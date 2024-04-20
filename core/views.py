from django.shortcuts import render

def main(request):
    year = 2024
    context = {
        'year': year
    }
    return render(request, 'main.html', context)
