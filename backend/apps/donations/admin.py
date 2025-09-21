<<<<<<< HEAD
# Donations Admin
from apps.donations.models import Donation, DonationCertificate

@admin.register(Donation)
class DonationAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['donation_id', 'donor_display_name', 'amount', 'status', 'wants_80g_certificate', 'created_at']
    list_filter = ['status', 'donation_type', 'wants_80g_certificate', 'created_at']
    search_fields = ['donation_id', 'donor_name', 'donor_email', 'donor__username']
    list_editable = ['status']
    readonly_fields = ['donation_id', 'created_at', 'completed_at']
    ordering = ['-created_at']

@admin.register(DonationCertificate)
class DonationCertificateAdmin(ModelAdmin):
    list_display = ['certificate_number', 'donation', 'financial_year', 'status', 'issued_date']
    list_filter = ['status', 'financial_year', 'issued_date']
    search_fields = ['certificate_number', 'donation__donor_name']
=======
# Donations Admin
from apps.donations.models import Donation, DonationCertificate

@admin.register(Donation)
class DonationAdmin(ModelAdmin, ImportExportModelAdmin):
    list_display = ['donation_id', 'donor_display_name', 'amount', 'status', 'wants_80g_certificate', 'created_at']
    list_filter = ['status', 'donation_type', 'wants_80g_certificate', 'created_at']
    search_fields = ['donation_id', 'donor_name', 'donor_email', 'donor__username']
    list_editable = ['status']
    readonly_fields = ['donation_id', 'created_at', 'completed_at']
    ordering = ['-created_at']

@admin.register(DonationCertificate)
class DonationCertificateAdmin(ModelAdmin):
    list_display = ['certificate_number', 'donation', 'financial_year', 'status', 'issued_date']
    list_filter = ['status', 'financial_year', 'issued_date']
    search_fields = ['certificate_number', 'donation__donor_name']
>>>>>>> e22bff9aeb50cc02bb683c74649041d66e908df0
    readonly_fields = ['certificate_number', 'issued_date']