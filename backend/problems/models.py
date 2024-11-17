# backend/problems/models.py

from django.db import models

class Problem(models.Model):
    title = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    difficulty = models.CharField(max_length=50)
    solution = models.TextField()

    def __str__(self):
        return self.title

class TestCase(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='test_cases')
    input_data = models.TextField()
    expected_output = models.TextField()
    difficulty = models.CharField(max_length=50)

    def __str__(self):
        return f"TestCase for {self.problem.title}"
