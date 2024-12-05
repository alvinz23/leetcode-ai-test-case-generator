from django.core.management.base import BaseCommand
from problems.api import generate_test_case

class Command(BaseCommand):
    help = "Generate a test case for a specific problem using the Gemini API."

    def add_arguments(self, parser):
        parser.add_argument("slug", type=str, help="The slug of the problem.")
        parser.add_argument("--api_key", type=str, help="Your Gemini API key.")

    def handle(self, *args, **kwargs):
        slug = kwargs["slug"]
        api_key = kwargs["api_key"]
        result = generate_test_case(slug, api_key)
        self.stdout.write(result)
