from django.urls import path
from . import views

app_name = 'person'

urlpatterns = [
    path('save_person', views.save_person, name='save_person'),
    path('search_person', views.search_person, name='search_person'),
    path('remove_person/<id>', views.remove_person, name='remove_person')
]