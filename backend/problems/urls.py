# backend/problems/urls.py

from django.urls import path
from . import views  # Import your views if you have any

urlpatterns = [
    path('', views.get_problem_data, name='problems'),
    path('generate-test-case/<slug:slug>/', views.generate_test_case, name='generate_test_case'),
]
