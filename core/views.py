from django.shortcuts import render
from django.middleware.csrf import get_token

def main(request):
    year = 2024
    csrf_token = get_token(request)

    context = {
        'year': year,
        'csrf_token': csrf_token,
    }

    return render(request, 'main.html', context)
