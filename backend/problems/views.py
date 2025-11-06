import json
import os
import re

import google.generativeai as genai
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Problem
from .serializers import ProblemSerializer
from django.db.models import Q


class ProblemListPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = "page_size"
    max_page_size = 1000


class ProblemListView(generics.ListAPIView):
    queryset = Problem.objects.all().order_by("id")
    serializer_class = ProblemSerializer
    pagination_class = ProblemListPagination

    def get_queryset(self):
        qs = super().get_queryset()
        query = self.request.query_params.get("q")
        if query:
            # Basic case-insensitive search across title and description
            return qs.filter(Q(title__icontains=query) | Q(description__icontains=query))
        return qs


class ProblemDetailView(generics.RetrieveAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer


class GenerateTestCasesView(APIView):
    def post(self, request):
        try:
            problem_id = int(request.data.get("problem_id"))
            num_cases = int(request.data.get("num_cases", 5))
            complexity = str(request.data.get("complexity", "medium")).lower()
            temperature = float(request.data.get("temperature", 0.7))
        except Exception:
            return Response({"detail": "Invalid input types."}, status=status.HTTP_400_BAD_REQUEST)

        if complexity not in {"low", "medium", "high"}:
            return Response({"detail": "complexity must be one of: low, medium, high"}, status=400)

        try:
            problem = Problem.objects.get(pk=problem_id)
        except Problem.DoesNotExist:
            return Response({"detail": "Problem not found."}, status=status.HTTP_404_NOT_FOUND)

        prompt = self._build_prompt(problem, num_cases, complexity, temperature)

        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return Response({"detail": "GEMINI_API_KEY not configured."}, status=500)

        genai.configure(api_key=api_key)
        model_name = "gemini-2.5-flash"
        try:
            model = genai.GenerativeModel(model_name)
            result = model.generate_content(
                prompt, generation_config={"temperature": temperature}
            )
        except Exception as e:
            return Response({"detail": f"LLM call failed: {e}"}, status=502)

        text = (result.text or "").strip()
        # Try to extract JSON array from the response in case fences/extra text appear
        json_str = self._extract_json_array(text)
        try:
            data = json.loads(json_str)
        except json.JSONDecodeError:
            return Response({"detail": "Model did not return valid JSON."}, status=502)

        valid, err = self._validate_cases(data)
        if not valid:
            return Response({"detail": f"Invalid test case format: {err}"}, status=502)

        return Response({
            "problem_id": problem_id,
            "test_cases": data,
        })

    def _build_prompt(self, problem: Problem, num_cases: int, complexity: str, temperature: float) -> str:
        return (
            "You are a professional software testing assistant.\n"
            "Your task is to automatically design high-quality input/output test cases \n"
            "for algorithmic coding problems (similar to LeetCode).\n\n"
            "---\n"
            "INSTRUCTIONS:\n"
            f"1. Read the full problem statement carefully.\n"
            f"2. Generate exactly {num_cases} diverse and challenging test cases.\n"
            "3. Each test case must include:\n"
            "   - \"input\": the full raw input string exactly as a user would provide.\n"
            "   - \"expected_output\": the correct program output for that input.\n"
            "   - \"category\": one of [\"base\", \"edge\", \"stress\"].\n"
            "4. Obey the complexity level and scale inputs accordingly:\n"
            "   - low → small, simple inputs (3–5 elements or minimal constraints)\n"
            "   - medium → moderately sized inputs (10–20 elements)\n"
            "   - high → large or near-constraint-limit inputs (50+ elements or stress scale)\n"
            "5. Respect all problem constraints, edge conditions, and logical validity.\n"
            "6. Ensure variety across categories (not all base cases).\n"
            "7. Output must be strictly valid JSON (no code fences, comments, or prose).\n\n"
            "---\n"
            "GENERATION SETTINGS:\n"
            f"- Number of test cases: {num_cases}\n"
            f"- Complexity level: {complexity}\n"
            f"- Creativity / Temperature: {temperature}\n\n"
            "---\n"
            "PROBLEM CONTEXT:\n"
            f"Title: {problem.title}\n"
            "Description:\n"
            f"{problem.description}\n\n"
            "Constraints:\n"
            f"{problem.constraints}\n\n"
            "Examples:\n"
            f"{problem.examples}\n\n"
            "---\n"
            "Return only the final JSON array:\n"
            "[\n"
            "  {\n"
            "    \"input\": \"...\",\n"
            "    \"expected_output\": \"...\",\n"
            "    \"category\": \"base|edge|stress\"\n"
            "  }\n"
            "]\n"
        )

    def _extract_json_array(self, text: str) -> str:
        # If the model returns extra text or code fences, isolate the JSON array portion
        m = re.search(r"\[.*\]", text, flags=re.DOTALL)
        return m.group(0) if m else text

    def _validate_cases(self, data):
        if not isinstance(data, list):
            return False, "not a list"
        allowed = {"base", "edge", "stress"}
        for idx, item in enumerate(data, 1):
            if not isinstance(item, dict):
                return False, f"item {idx} not an object"
            if not all(k in item for k in ("input", "expected_output", "category")):
                return False, f"item {idx} missing required keys"
            if item["category"] not in allowed:
                return False, f"item {idx} category invalid"
        return True, None


