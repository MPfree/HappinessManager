from django.urls import path
from . import views
from django.contrib.auth.decorators import login_required


urlpatterns = [
    path('', views.home, name='happy-home'),
    path('new/', login_required(views.NewEntryView.as_view()), name='happy-newentry'),
    path('api/datefiltereddata', views.DateFilteredHappinessData.as_view(), name = 'happy-datefiltereddata'),
    path('api/getIndicatorNames', views.getIndicatorNames, name = 'happy-indicatornames'),
    path('api/getIndicatorWeights', views.getIndicatorWeights.as_view(), name = 'happy-indicatorweights'),
    path('visualize/', views.visualize, name='happy-visualize'),
    path('journal/', views.journal, name='happy-journal'),
    path('api/singleindicatordata', views.SingeIndicatorData.as_view(), name = 'happy-singleindicatordata'),
    path('sandbox', views.sandbox, name='happy-sandbox'),
    path('about', views.about, name = 'happy-about')
]