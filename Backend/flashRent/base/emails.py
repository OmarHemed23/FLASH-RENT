from django.core.mail import send_mail
from django.conf import settings

def send_email(subject, message, recipient_list):
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False

def send_rental_application_received_email(guest_email, property_name):
    subject = f'Rental Application Received for {property_name}'
    message = (f'Hello,\n\nYour rental application for {property_name} has been received and is awaiting review.\n\n'
               'Regards,\nFlash Rent Team')
    return send_email(subject, message, [guest_email])

def send_application_accepted_email(email, property_name, username=None, password=None):
    subject = 'Rental Application Accepted'
    if username and password:
        message = (f'Congratulations! Your rental application for {property_name} has been accepted.\n'
                   f'Your login credentials are:\nUsername: {username}\nPassword: {password}\n\n'
                   'Regards,\nFlash Rent Team')
    else:
        message = (f'Congratulations! Your rental application for {property_name} has been accepted.\n\n'
                   'Regards,\nFlash Rent Team')
    return send_email(subject, message, [email])

def send_application_rejected_email(email):
    subject = 'Rental Application Rejected'
    message = ('Hello,\n\nWe regret to inform you that your rental application has been rejected.\n\n'
               'Regards,\nFlash Rent Team')
    return send_email(subject, message, [email])

def send_password_change_email(user):
    subject = 'Password Change Notification'
    message = (f'Hello {user.username},\n\nYour password has been successfully changed.\n\n'
               'If you did not make this change, please contact support immediately.\n\n'
               'Best regards,\nFlash Rent Team')
    return send_email(subject, message, [user.email])

def send_request_received_email(maintenance_request):
    subject = 'Maintenance Request Received'
    message = (f'Your maintenance request for {maintenance_request.property.name} has been received. \n\n '
                'Our team will review it and schedule the maintenance soon.\n\n'
                'Best regards,\nFlash Rent Team')
    recipient_list = [maintenance_request.tenant.tenant.email]
    return send_email(subject, message, recipient_list)

def send_schedule_email(maintenance_request):
    subject = 'Maintenance Request Scheduled'
    message = (f'Your maintenance request for {maintenance_request.property.name} has been scheduled. It is expected to be done by {maintenance_request.schedule_date}.\n\n'
                'Best regards,\nFlash Rent Team')
    recipient_list = [maintenance_request.tenant.tenant.email]
    return send_email(subject, message, recipient_list)

def send_completion_email(maintenance_request):
    subject = 'Maintenance Request Completed'
    message = (f'Your maintenance request for {maintenance_request.property.name} has been completed on {maintenance_request.completed_date}.\n\n'
                'Best regards,\nFlash Rent Team')
    recipient_list = [maintenance_request.tenant.tenant.email]
    return send_email(subject, message, recipient_list)


