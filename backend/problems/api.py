import google.generativeai as genai
from .models import Problem

def get_problem_data(slug):
    try:
        problem = Problem.objects.get(slug=slug)
        return {
            "title": problem.title,
            "description": problem.description,
            "difficulty": problem.difficulty,
            "solution": problem.solution,
        }
    except Problem.DoesNotExist:
        return None

def format_prompt(problem_data):
    prompt = f"""
    You are a highly capable coding assistant. Your task is to generate a comprehensive test case for the following problem:

    Title: {problem_data['title']}
    Difficulty: {problem_data['difficulty']}
    Description: {problem_data['description']}

    Here is a Python solution to the problem:
    {problem_data['solution']}

    Please provide a comprehensive test case with inputs and expected outputs for this problem and provie edge cases as well, provide 
    three test cases one that is of simple small size, one that is of medium size and one that is a complex large test case, also provide some potential edge cases if you can but you should not exceed 5 test case.
    """
    return prompt

def generate_test_case(slug, api_key):
    # Fetch problem data
    problem_data = get_problem_data(slug)
    if not problem_data:
        return f"Problem with slug '{slug}' not found."

    # Format the prompt
    prompt = format_prompt(problem_data)

    # Configure Gemini API
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name="gemini-1.5-flash")

    # Generate content based on the prompt
    response = model.generate_content(prompt)

    # Return the generated text
    return response.text

# from django.http import JsonResponse
# from .api import generate_test_case

# def generate_test_case_view(request, slug):
#     api_key = "AIzaSyDEJQXCze5gEt5_30jowk4iMg1ewSMCBpI"  
#     result = generate_test_case(slug, api_key)
#     return JsonResponse({"test_case": result})
