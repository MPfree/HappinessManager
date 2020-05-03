import datetime
import json
from .utils import getAverageDict, getUserHappinessDataVerboseNamesDict
from dateutil.relativedelta import relativedelta
from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import CreateView, UpdateView
from .models import UserHappinessData
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserHappinessDataSerializer



# Create your views here.

def home(request):
    #get verbose names and remove unwanted fields. Send the dictionary to the home template
    name_verbosename = getUserHappinessDataVerboseNamesDict()
    name_verbosename.pop('id')
    name_verbosename.pop('date')
    name_verbosename.pop('author')

    context = {"indicator_names": name_verbosename}

    return render(request, 'happy/home.html', context)

def visualize(request):
    return render(request, 'happy/visualize.html')

def getIndicatorNames(request):
    name_verbosename = getUserHappinessDataVerboseNamesDict()
    name_verbosename.pop('id')
    name_verbosename.pop('date')
    name_verbosename.pop('author')

    return JsonResponse((json.dumps(name_verbosename)), safe=False)

class NewEntryView(LoginRequiredMixin, CreateView):
    #This is the view for entering data. The template_name specifies the template associated with this view
    #This built in view creates the form it sends to the template using the UserHappinessData model
    #It displays only the fields specified below
    template_name = 'happy/entry.html'
    model = UserHappinessData
    fields = ['sleep', 'exercise', 'social', 'weather', 'metime', 'socialmedia', 'happy']
    #adds the current user to the form to make sure it matches the model fields
    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

class DateFilteredHappinessData(APIView):
    def get(self, request, form=None):
        #retrieve period sent with the request
        period = request.GET.get("period_name")
        todays_date = datetime.date.today()
        date_delta = None
        #set the datedelta depending on the button the user clicked.
        if period == 'alltime':
            date_delta = relativedelta(years=1000)
        if period == 'yesterday':
            date_delta = datetime.timedelta(days=1)
        if period == 'pastweek':
            date_delta = datetime.timedelta(days=7)
        if period == 'pastmonth':
            date_delta = relativedelta(months=1)
        if period == 'pastyear':
            date_delta = relativedelta(years=1)
        
        date_filter = (todays_date - date_delta).strftime('%Y-%m-%d')
        #retrieve all UserHappinessData objects that fit the date filter
        days = UserHappinessData.objects.filter(author=request.user, date__gte=date_filter).values("sleep", "exercise", "social", "metime", "weather", "socialmedia", "happy")
        #get the average of the UserHappinessData objects
        indicators = getAverageDict(days)

        serializer = UserHappinessDataSerializer(indicators)
        return Response(serializer.data)

class SingeIndicatorData(APIView):
    def get(self, request, format=None):
        indicator_name = [request.GET.get("indicator_name")]
        indicator_data = list(UserHappinessData.objects.filter(author=request.user).values(*indicator_name))
        return JsonResponse({"indicator_data": indicator_data}, safe=False)

