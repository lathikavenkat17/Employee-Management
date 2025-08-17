from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from employee.models import Employee

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        try:
            user = Employee.objects.get(email=email)
            request.session['employee_id'] = user.id
            return JsonResponse({
                'id': user.id,  # Added id here
                'firstName': user.firstName,
                'lastName': user.lastName,
                'email': user.email,
                'role': user.role,
            })
        except Employee.DoesNotExist:
            return JsonResponse({'error': 'Invalid email'}, status=401)
    return JsonResponse({'error': 'POST required'}, status=400)


def profile_view(request):
    employee_id = request.session.get('employee_id')
    print(f"Request user: {request.user}, authenticated: {request.user.is_authenticated}")
    if employee_id:
        try:
            user = Employee.objects.get(id=employee_id)
            return JsonResponse({
                'id': user.id,  # Added id here
                'firstName': user.firstName,
                'lastName': user.lastName,
                'email': user.email,
                'role': user.role,
            })
        except Employee.DoesNotExist:
            pass
    return JsonResponse({'error': 'Unauthorized'}, status=401)

def logout_view(request):
    try:
        del request.session['employee_id']
    except KeyError:
        pass
    return JsonResponse({'message': 'Logged out'})
