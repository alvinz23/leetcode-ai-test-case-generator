from django.contrib import admin

# Register your models here.
# backend/problems/admin.py

from django.contrib import admin
from .models import Problem, TestCase

@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ('title', 'difficulty')
    search_fields = ('title', 'description')

@admin.register(TestCase)
class TestCaseAdmin(admin.ModelAdmin):
    list_display = ('problem', 'difficulty')
    search_fields = ('input_data', 'expected_output')
    list_filter = ('difficulty',)
