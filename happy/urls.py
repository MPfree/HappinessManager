from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name='happy-home'),
    path('new/', views.NewEntryView.as_view(), name='happy-newentry'),
    path('api/datefiltereddata', views.DateFilteredHappinessData.as_view(), name = 'happy-datefiltereddata'),
    path('api/getIndicatorNames', views.getIndicatorNames, name = 'happy-indicatornames'),
    path('visualize/', views.visualize, name='happy-visualize'),
    path('api/singleindicatordata', views.SingeIndicatorData.as_view(), name = 'happy-singleindicatordata'),


]