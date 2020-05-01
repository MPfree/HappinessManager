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


# Create your views here.

def home(request):
    name_verbosename = getUserHappinessDataVerboseNamesDict()
    name_verbosename.pop('id')
    name_verbosename.pop('date')
    name_verbosename.pop('author')

    context = {"indicator_names": name_verbosename}

    return render(request, 'happy/home.html', context)

class NewEntryView(LoginRequiredMixin, CreateView):
    template_name = 'happy/entry.html'
    model = UserHappinessData
    fields = ['sleep', 'exercise', 'social', 'weather', 'metime', 'socialmedia', 'happy']
 
    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

def getDateFilteredHappinessData(request):
    name_verbosename = getUserHappinessDataVerboseNamesDict()

    period = request.GET.get("period_name")
    todays_date = datetime.date.today()
    date_delta = None

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
    
    days = UserHappinessData.objects.filter(author=request.user, date__gte=date_filter).values("sleep", "exercise", "social", "metime", "weather", "socialmedia", "happy")
    indicators = getAverageDict(days)

    verbose_indicators = {}

    for key,value in indicators.items():
        verbose_name = name_verbosename.get(key)
        verbose_indicators[verbose_name] = value

    if len(verbose_indicators)==0:
        return JsonResponse('{}', safe=False)
    else:
        context_json = json.dumps(verbose_indicators)
        return JsonResponse(context_json, safe=False)


