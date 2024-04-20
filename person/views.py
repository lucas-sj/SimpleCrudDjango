from django.shortcuts import render
from django.http import JsonResponse
from person.models import Person

def save_person(request):
    if request.method == "POST":
        id_person = request.POST.get('id_person')
        name = request.POST.get('name')
        last_name = request.POST.get('last_name')
        age = request.POST.get('age')

        if id_person:
            try:
                person = Person.objects.get(id=id_person)
                person.person_name = name
                person.person_last_name = last_name
                person.person_age = age
                person.save()
                return JsonResponse({'success': True, 'message': 'Pessoa atualizada com sucesso.'})
            except Person.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Pessoa não encontrada.'}, status=404)
        else:
            if name:
                person = Person.objects.create(
                    person_name=name,
                    person_last_name=last_name,
                    person_age=age
                )
                return JsonResponse({'success': True, 'message': 'Pessoa salva com sucesso.'})
            else:
                return JsonResponse({'success': False, 'message': 'Erro ao salvar a pessoa. Todos os campos são obrigatórios.'}, status=400)
    else:
        return JsonResponse({'success': False, 'message': 'Método não permitido.'}, status=405)


def search_person(request):
    if request.method == "GET":
        person_name = request.GET.get('person')
        if person_name:
            persons = Person.objects.filter(person_name__icontains=person_name)

            if persons.exists():
                context = {
                    'persons': persons
                }
                return render(request, 'result_person.html', context)
            else:
                return JsonResponse({'success': False, 'message': 'Pessoa não existe.'})
        else:
            return JsonResponse({'success': False, 'message': 'Parâmetro "person" não foi fornecido.'})
    else:
        return JsonResponse({'success': False, 'message': 'Método não permitido.'}, status=405)


def remove_person(request, id):
    if request.method == "DELETE":
        try:
            person = Person.objects.get(id=id)
            person.delete()
            return JsonResponse({'success': True, 'message': 'Pessoa removida com sucesso.'})
        except Person.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Pessoa não encontrada.'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Erro ao remover a pessoa.'}, status=500)
    else:
        return JsonResponse({'success': False, 'message': 'Método não permitido.'}, status=405)