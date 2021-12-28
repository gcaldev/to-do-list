from django.shortcuts import redirect, render
from .models import Task
from django.http import JsonResponse
from django.http import HttpResponse


# Create your views here.
# PASS : todoapp123
def index(request):
    if request.method == "POST":
        activities = {"0","1","2","3"}
        title = request.POST["title_input"]
        description = request.POST["description_input"]
        activity = request.POST["activity_type"]
        date = request.POST["date_input"]
        if activity in activities:
            activity = int(activity)
        else:
            return HttpResponse("Activity ERROR")
        if "is_done" in request.POST:
            task_is_done = True
        else:
            task_is_done = False
        if request.POST["edit_id"] == "":
            print("entra en crear")
            Task.objects.create(title = title, description = description, already_done = task_is_done, date = date, activity = activity)
        else:
            edited_task = Task.objects.get(id = request.POST["edit_id"])
            edited_task.title = title
            edited_task.description = description
            edited_task.already_done = task_is_done
            edited_task.date = date
            edited_task.activity = activity
            edited_task.save()
            print("entra en edit")

    all_tasks = Task.objects.all()
    return render(request, "index.html", {"all_tasks" : all_tasks})

def taskRemove(request):
    if request.method == "POST":
        id = request.POST.get("task_id")
        task = Task.objects.get(id = id)
        task.delete()
        return HttpResponse("Successful")
    return HttpResponse("Something went wrong")

def taskcfg(request):
    if request.method == "POST":
        id = request.POST["task_id"]
        task = Task.objects.get(id = id)
        return JsonResponse(data = {
            "title":task.title,
            "description":task.description,
            "date":task.date,
            "activity":task.activity,
            "is_done":task.already_done,
            "id":task.id
        })
    return HttpResponse("Something went wrong")