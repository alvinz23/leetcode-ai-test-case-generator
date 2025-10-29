import google.generativeai as genai
from .models import Problem
import os 


api_key = os.getenv("API_KEY")

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

    Please provide a comprehensive test case with inputs and expected outputs for this problem. Return one easy test case where it is simple and short, one of medium size where it gets a little bit more complex
    then return a super complex test case, advanced and pretty long relative to the problem, also provide two edge cases that the problem can have for a total of 5 test cases.
    """
    return prompt

def generate_test_case(slug):
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
