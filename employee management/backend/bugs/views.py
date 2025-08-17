from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import BugDetails, BugHistory, BugImage, BugHistoryImage
from .serializers import BugDetailsSerializer, BugHistorySerializer

class BugsViewSet(viewsets.ModelViewSet):
    queryset = BugDetails.objects.all()
    serializer_class = BugDetailsSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        partial = kwargs.pop('partial', False)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        history = BugHistory.objects.create(
            bug=instance,
            title=instance.title,
            name=request.data.get('name', 'Unknown'),
            role=request.data.get('role', 'Unknown'),
            status=instance.status,
            comments=instance.comments,
        )

        images = request.FILES.getlist('images')
        for image in images:
            try:
                BugImage.objects.create(bug=instance, image=image)
                BugHistoryImage.objects.create(bug_history=history, image=image)  # fixed key here
            except Exception as e:
                print(f"Error saving image: {e}")
                return Response({"error": f"Failed to save image: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_200_OK)

class BugHistoryViewSet(viewsets.ModelViewSet):
    queryset = BugHistory.objects.all()
    serializer_class = BugHistorySerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    def get_queryset(self):
        qs = super().get_queryset()
        bug_id = self.request.query_params.get('bug')
        bug_title = self.request.query_params.get('title')
        if bug_id:
            qs = qs.filter(bug_id=bug_id)
        if bug_title:
            qs = qs.filter(title=bug_title)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        history = serializer.save()

        images = request.FILES.getlist('history_images')
        for image in images:
            BugHistoryImage.objects.create(bug_history=history, image=image)  # fixed key here

        return Response(serializer.data, status=status.HTTP_201_CREATED)
