from django.urls import path

from .views import (
    ProblemListView,
    ProblemDetailView,
    GenerateTestCasesView,
)


urlpatterns = [
    path("problems/", ProblemListView.as_view(), name="problems-list"),
    path("problems/<int:pk>/", ProblemDetailView.as_view(), name="problems-detail"),
    path("generate/", GenerateTestCasesView.as_view(), name="generate-testcases"),
]


