from django.db import models
from employee.models import Employee

class ProjectDetails(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    developers = models.ManyToManyField(Employee, related_name='developer_projects')
    testers = models.ManyToManyField(Employee, related_name='tester_projects')
    team_lead = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='lead_projects')
    manager = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='managed_projects')
    created_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='created_projects')
    status = models.CharField(max_length=20, default='Pending')

    def __str__(self):
        return self.name
