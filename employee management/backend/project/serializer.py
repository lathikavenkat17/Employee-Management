from rest_framework import serializers
from .models import ProjectDetails
from employee.models import Employee

class EmployeeSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'firstName', 'lastName')

class ProjectDetailsSerializer(serializers.ModelSerializer):
    team_lead = EmployeeSimpleSerializer(read_only=True)
    manager = EmployeeSimpleSerializer(read_only=True)
    developers = EmployeeSimpleSerializer(many=True, read_only=True)
    testers = EmployeeSimpleSerializer(many=True, read_only=True)

    # Write-only fields to accept IDs on create/update
    team_lead_id = serializers.PrimaryKeyRelatedField(
        source='team_lead', queryset=Employee.objects.all(), write_only=True, required=False, allow_null=True
    )
    manager_id = serializers.PrimaryKeyRelatedField(
        source='manager', queryset=Employee.objects.all(), write_only=True, required=False, allow_null=True
    )
    developers_ids = serializers.PrimaryKeyRelatedField(
        source='developers', many=True, queryset=Employee.objects.all(), write_only=True, required=False
    )
    testers_ids = serializers.PrimaryKeyRelatedField(
        source='testers', many=True, queryset=Employee.objects.all(), write_only=True, required=False
    )

    class Meta:
        model = ProjectDetails
        fields = (
            'id',
            'name',
            'description',
            'start_date',
            'end_date',
            'team_lead',
            'manager',
            'developers',
            'testers',
            'created_by',
            'team_lead_id',
            'manager_id',
            'developers_ids',
            'testers_ids',
            'status',
        )
