from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from datetime import datetime
from django.urls import reverse
from django.core.validators import MaxValueValidator, MinValueValidator

class UserHappinessData(models.Model):

    author=models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    sleep = models.FloatField("Sleep", validators=[
        MaxValueValidator(24),
        MinValueValidator(0)
    ])
    exercise = models.FloatField("Exercise", validators=[
        MaxValueValidator(24),
        MinValueValidator(0)
    ])
    social = models.FloatField("Social", validators=[
        MaxValueValidator(24),
        MinValueValidator(0)
    ])
    metime = models.FloatField("Alone Time", validators=[
        MaxValueValidator(24),
        MinValueValidator(0)
    ])
    weather = models.FloatField("Weather", validators=[
        MaxValueValidator(10),
        MinValueValidator(0)
    ])
    socialmedia = models.FloatField("Social Media", validators=[
        MaxValueValidator(24),
        MinValueValidator(0)
    ])
    happy = models.IntegerField("Happiness", validators=[
        MaxValueValidator(10),
        MinValueValidator(0)
    ])

    def __str__(self):
        user = (self.author).username
        return user + ' ' + str(self.happy)

    def get_absolute_url(self):
        return reverse('happy-home')






