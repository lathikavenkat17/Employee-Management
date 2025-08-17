# views.py
from rest_framework import viewsets
from .models import ProjectDetails
from .serializer import ProjectDetailsSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = ProjectDetails.objects.all()
    serializer_class = ProjectDetailsSerializer
