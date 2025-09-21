

from rest_framework import generics, viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from django.db.models import Q, Count, Sum
import razorpay
import json
import uuid
from datetime import datetime, timedelta

# Import your models (adjust imports based on actual structure)
from apps.core.models import Team, Department, FocusArea, ImpactStory, Contact, SiteStats
from apps.membership.models import MembershipTier, MembershipApplication, Payment
from apps.research.models import Publication, ResearchProject
from apps.donations.models import Donation, DonationCertificate
from apps.issues.models import ReportedIssue, IssueCategory
from apps.cms.models import SiteSettings, Page, Slider

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class TeamListView(generics.ListAPIView):
    """Get team members"""
    queryset = Team.objects.filter(status='active')
    permission_classes = [AllowAny]

    def list(self, request):
        team_members = self.get_queryset().order_by('order', 'name')
        data = []
        for member in team_members:
            data.append({
                'id': str(member.id),
                'name': member.name,
                'position': member.get_position_display(),
                'bio_short': member.bio_short,
                'bio_long': member.bio_long,
                'photo': member.photo.url if member.photo else None,
                'email': member.email,
                'linkedin': member.linkedin,
                'twitter': member.twitter,
            })
        return Response(data)

@api_view(['POST'])
@permission_classes([AllowAny])
def contact_form_submit(request):
    """Handle contact form submissions"""
    try:
        data = request.data

        contact = Contact.objects.create(
            name=data.get('name'),
            email=data.get('email'),
            subject=data.get('subject'),
            message=data.get('message')
        )

        # Send notification email
        try:
            email_message = f"""
New contact form submission received:

Name: {contact.name}
Email: {contact.email}
Subject: {contact.get_subject_display()}
Message: {contact.message}

Submitted at: {contact.created_at}
            """

            send_mail(
                subject=f'New Contact Form Submission: {contact.get_subject_display()}',
                message=email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.DEFAULT_FROM_EMAIL],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Failed to send notification email: {e}")

        return Response({
            'success': True,
            'message': 'Thank you for your message. We will get back to you soon!'
        })

    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_order(request):
    """Create Razorpay order for payment"""
    try:
        data = request.data
        payment_type = data.get('payment_type')  # 'membership' or 'donation'
        amount = float(data.get('amount'))

        # Create Razorpay order
        razorpay_order = razorpay_client.order.create({
            'amount': int(amount * 100),  # Convert to paise
            'currency': 'INR',
            'payment_capture': '1'
        })

        # Create payment record
        payment = Payment.objects.create(
            user=request.user,
            payment_type=payment_type,
            amount=amount,
            razorpay_order_id=razorpay_order['id'],
            status='pending'
        )

        return Response({
            'success': True,
            'payment_id': payment.payment_id,
            'razorpay_order_id': razorpay_order['id'],
            'amount': amount,
            'currency': 'INR',
            'razorpay_key': settings.RAZORPAY_KEY_ID
        })

    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    """Verify Razorpay payment"""
    try:
        data = request.data

        # Get payment details
        payment_id = data.get('payment_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_signature = data.get('razorpay_signature')

        # Get payment object
        payment = get_object_or_404(Payment, payment_id=payment_id, user=request.user)

        # Verify signature
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }

        try:
            razorpay_client.utility.verify_payment_signature(params_dict)
        except razorpay.errors.SignatureVerificationError:
            payment.status = 'failed'
            payment.save()
            return Response({
                'success': False,
                'error': 'Payment verification failed'
            }, status=400)

        # Payment verified successfully
        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.status = 'completed'
        payment.completed_at = timezone.now()
        payment.save()

        return Response({
            'success': True,
            'message': 'Payment verified successfully!',
            'payment_id': payment.payment_id
        })

    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=400)

@api_view(['GET'])
@permission_classes([AllowAny])
def homepage_data(request):
    """Get all data needed for homepage"""
    try:
        # Get site stats
        stats = SiteStats.objects.first()
        if not stats:
            stats = SiteStats.objects.create()

        return Response({
            'stats': {
                'active_projects': stats.active_projects,
                'total_members': stats.total_members,
                'research_papers_published': stats.research_papers_published,
                'cities_impacted': stats.cities_impacted,
            },
        })

    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)
