# bugs/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BugsViewSet, BugHistoryViewSet

router = DefaultRouter()
router.register(r'bugs', BugsViewSet)
router.register(r'bug-history', BugHistoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
