from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'), # "" indicates the main page website
    path('taskRemove/', views.taskRemove, name="taskRemove"),
    path('config_task/', views.taskcfg, name="taskcfg"),
]