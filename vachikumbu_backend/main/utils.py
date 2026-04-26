from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone

current_year = timezone.now().year

def send_custom_mail(name, email, subject, message):
    # -----------------------------
    # 1. EMAIL TO YOU (Notification)
    # -----------------------------
    admin_subject = f"Portfolio Inquiry: {subject or f'New message from {name}'}"
    
    admin_context = {
        'name': name,
        'email': email,
        'subject': subject or 'No subject',
        'message': message,
        'current_year': current_year
    }
    
    admin_html = render_to_string('emails/admin_notification.html', admin_context)
    
    admin_email = EmailMultiAlternatives(
        subject=admin_subject,
        body=f"Name: {name}\nEmail: {email}\nSubject: {subject}\n\nMessage:\n{message}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=["contact@vachikumbu.com"],
    )
    admin_email.attach_alternative(admin_html, "text/html")
    admin_email.send(fail_silently=False)

    # -----------------------------
    # 2. EMAIL TO SENDER (Auto-reply)
    # -----------------------------
    user_subject = "Thanks for reaching out! 🙌"
    
    user_context = {
        'name': name,
        'subject': subject or 'No subject',
        'message': message,
        'current_year': '2026'
    }
    
    user_html = render_to_string('emails/user_autoreply.html', user_context)
    
    user_email = EmailMultiAlternatives(
        subject=user_subject,
        body=f"Hi {name},\n\nThanks for reaching out! I'll get back to you soon.\n\nBest regards,\nKudakwashe Chikumbu",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[email],
    )
    user_email.attach_alternative(user_html, "text/html")
    user_email.send(fail_silently=False)


def send_notification_email(name, subject, message):
    notification_context = {
        'name': name,
        'subject': subject,
        'message': message,
        'current_year': current_year
    }

    notification_subject = "New Notification on vachikumbu.com"

    notification_html = render_to_string('emails/notification_email.html', notification_context)

    notification_email = EmailMultiAlternatives(
        subject=notification_subject,
        body=f"Name: {name}\nSubject: {subject}\n\nMessage: {message}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=['alerts@vachikumbu.com']
    )
    notification_email.attach_alternative(notification_html, "text/html")
    notification_email.send(fail_silently=False)