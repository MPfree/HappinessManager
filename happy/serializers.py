from rest_framework import serializers
from .models import UserHappinessData

class UserHappinessDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserHappinessData
        fields = ['date', 'sleep', 'exercise', 'social', 'weather', 'metime', 'socialmedia', 'happy']