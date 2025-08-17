from rest_framework import viewsets
from .models import Leave
from .serializer import LeaveSerializer

class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.all().order_by('-start_date')
    serializer_class = LeaveSerializer
