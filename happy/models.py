from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from datetime import datetime
from django.urls import reverse

class UserHappinessData(models.Model):

    author=models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(default=timezone.now)
    sleep = models.FloatField("Sleep")
    exercise = models.FloatField("Exercise")
    social = models.FloatField("Social")
    metime = models.FloatField("Alone Time")
    weather = models.FloatField("Weather")
    socialmedia = models.FloatField("Social Media")
    happy = models.IntegerField("Happiness")

    def __str__(self):
        user = (self.author).username
        return user + ' ' + str(self.happy)

    def get_absolute_url(self):
        return reverse('happy-home')






