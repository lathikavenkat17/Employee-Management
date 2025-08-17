# task/serializers.py or wherever your TaskDetailsSerializer is
from rest_framework import serializers
from project.models import ProjectDetails
from employee.models import Employee
from employee.serializers import EmployeeNameIdSerializer  # Use the lightweight one
from .models import TaskDetails

class TaskDetailsSerializer(serializers.ModelSerializer):
    # Use lightweight serializer for read-only nested employee data
    developers = EmployeeNameIdSerializer(many=True, read_only=True)
    developers_ids = serializers.PrimaryKeyRelatedField(
        source='developers',
        many=True,
        queryset=Employee.objects.all(),
        write_only=True
    )

    testers = EmployeeNameIdSerializer(many=True, read_only=True)
    testers_ids = serializers.PrimaryKeyRelatedField(
        source='testers',
        many=True,
        queryset=Employee.objects.all(),
        write_only=True
    )

    # Project FK
    project_name = serializers.StringRelatedField(read_only=True)
    project_name_id = serializers.PrimaryKeyRelatedField(
        source='project_name',
        queryset=ProjectDetails.objects.all(),
        write_only=True
    )

    class Meta:
        model = TaskDetails
        fields = (
            'id',
            'name',
            'project_name',
            'project_name_id',
            'description',
            'start_date',
            'end_date',
            'developers',
            'developers_ids',
            'testers',
            'testers_ids',
            'created_by',
            'status',
        )
