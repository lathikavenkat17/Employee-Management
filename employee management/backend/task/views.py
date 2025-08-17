# views.py
from rest_framework import viewsets
from .models import TaskDetails
from .serializers import TaskDetailsSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = TaskDetails.objects.all()
    serializer_class = TaskDetailsSerializer
