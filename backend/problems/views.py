# backend/problems/views.py

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Problem, TestCase
from .serializers import ProblemSerializer, TestCaseSerializer
import requests
from django.conf import settings
import os

class ProblemViewSet(viewsets.ModelViewSet):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer

    @action(detail=True, methods=['post'])
    def generate_test_case(self, request, pk=None):
        problem = self.get_object()
        difficulty = request.data.get('difficulty')

        if difficulty not in dict(Problem.DIFFICULTY_CHOICES):
            return Response({'error': 'Invalid difficulty level.'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve existing test cases to include in the prompt
        existing_test_cases = TestCase.objects.filter(problem=problem, difficulty=difficulty)
        known_tests = "\n".join([f"Input: {tc.input_data}\nOutput: {tc.expected_output}" for tc in existing_test_cases])

        # Prepare the prompt
        prompt = (
            f"Generate a {difficulty} test case for the following problem:\n\n"
            f"Problem: {problem.title}\n"
            f"Description: {problem.description}\n"
            f"Solution: {problem.solution}\n\n"
            f"Known Test Cases:\n{known_tests}\n\n"
            f"New Test Case:"
        )

        # Call the Google Gemini API
        gemini_api_url = "https://gemini-api.google.com/generate"  # Replace with actual endpoint
        headers = {
            "Authorization": f"Bearer {os.getenv('GEMINI_API_KEY')}",
            "Content-Type": "application/json",
        }
        payload = {
            "prompt": prompt,
            "max_tokens": 150,  # Adjust as needed
        }

        response = requests.post(gemini_api_url, headers=headers, json=payload)

        if response.status_code == 200:
            generated_text = response.json().get('generated_text', '')
            # Parse the generated text to extract input and output
            try:
                input_part, output_part = generated_text.strip().split('\nOutput:')
                input_data = input_part.replace('Input:', '').strip()
                expected_output = output_part.strip()

                # Create a new TestCase instance
                new_test_case = TestCase.objects.create(
                    problem=problem,
                    input_data=input_data,
                    expected_output=expected_output,
                    difficulty=difficulty
                )
                serializer = TestCaseSerializer(new_test_case)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValueError:
                return Response({'error': 'Failed to parse generated test case.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'error': 'Failed to generate test case.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
