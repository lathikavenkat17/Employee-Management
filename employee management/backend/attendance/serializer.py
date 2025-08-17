from rest_framework import serializers
from .models import Leave
from employee.models import Employee  # import Employee model

class EmployeeBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'firstName', 'lastName']

class LeaveSerializer(serializers.ModelSerializer):
    employee = EmployeeBasicSerializer(read_only=True)
    employee_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(),
        source='employee',
        write_only=True
    )

    class Meta:
        model = Leave
        fields = [
            'id',
            'employee',      # nested read-only
            'employee_id',   # for POST/PUT
            'leave_type',
            'comment',
            'number_of_days',
            'start_date',
            'end_date',
            'reason',
            'status',
        ]
