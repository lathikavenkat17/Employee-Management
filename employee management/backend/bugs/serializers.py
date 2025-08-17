from rest_framework import serializers
from employee.models import Employee
from employee.serializers import EmployeeNameIdSerializer
from .models import BugDetails, BugHistory, BugImage, BugHistoryImage
from task.models import TaskDetails

class BugImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = BugImage
        fields = ['id', 'image']

    def get_image(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

class BugHistoryImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = BugHistoryImage
        fields = ['id', 'image']

    def get_image(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

class BugDetailsSerializer(serializers.ModelSerializer):
    assigned_to = EmployeeNameIdSerializer(many=True, read_only=True)
    assigned_to_ids = serializers.PrimaryKeyRelatedField(
        source='assigned_to',
        many=True,
        queryset=Employee.objects.all(),
        write_only=True,
    )
    task = serializers.StringRelatedField(read_only=True)
    task_id = serializers.PrimaryKeyRelatedField(
        source='task',
        queryset=TaskDetails.objects.all(),
        write_only=True,
    )
    images = BugImageSerializer(many=True, read_only=True)

    class Meta:
        model = BugDetails
        fields = (
            'id',
            'task',
            'task_id',
            'title',
            'description',
            'assigned_to',
            'assigned_to_ids',
            'priority',
            'status',
            'comments',
            'assigned_by',
            'images',
        )

class BugHistorySerializer(serializers.ModelSerializer):
    images = BugHistoryImageSerializer(many=True, read_only=True)

    class Meta:
        model = BugHistory
        fields = [
            'id',
            'bug',
            'title',
            'name',
            'role',
            'status',
            'comments',
            'timestamp',
            'images',
        ]
