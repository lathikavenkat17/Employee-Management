from django.urls import path
from .views import EmployeeView, EmployeeDetailView,HRListView,ManagerListView,TeamLeadListView

urlpatterns = [
    path('employee/', EmployeeView.as_view(), name='employee'),              # List + Create
    path('employee/<int:pk>/', EmployeeDetailView.as_view(), name='emp-detail'), 
    path('hr/', HRListView.as_view(), name='hr-list'),
    path('Manager/',ManagerListView.as_view(),name='Manager-list'),
    path('TL/',TeamLeadListView.as_view(),name='TL-list') # ✅ Detail view: GET, PUT, DELETE
]
