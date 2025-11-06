from rest_framework import serializers

from .models import Problem


class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = [
            "id",
            "slug",
            "title",
            "description",
            "constraints",
            "examples",
            "difficulty",
            "created_at",
            "updated_at",
        ]


