from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='happy-home'),
    path('new/', views.NewEntryView.as_view(), name='happy-newentry'),
    path('api/datefiltereddata', views.getDateFilteredHappinessData, name = 'happy-datefiltereddata')
]