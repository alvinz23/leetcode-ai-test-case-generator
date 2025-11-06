from django.contrib import admin

from .models import Problem


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ("id", "slug", "title", "difficulty")
    search_fields = ("slug", "title")
    list_filter = ("difficulty",)


