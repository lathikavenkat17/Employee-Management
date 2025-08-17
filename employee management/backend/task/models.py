from django.db import models
from employee.models import Employee
from project.models import ProjectDetails


class TaskDetails(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    start_date= models.DateField()
    end_date = models.DateField()
    project_name = models.ForeignKey(ProjectDetails, on_delete=models.CASCADE, related_name='tasks')
    developers = models.ManyToManyField(Employee, related_name='developer_task')
    testers = models.ManyToManyField(Employee, related_name='tester_task')
    created_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='created_task')
    status = models.CharField(max_length=20, default='Pending')

    def __str__(self):
        return self.name

