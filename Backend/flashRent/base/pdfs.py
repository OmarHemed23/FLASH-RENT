from io import BytesIO
import reportlab
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.contrib import admin
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from .models import Tenant, Property

def generate_lease_agreement(tenant):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    story.append(Paragraph('Lease Agreement', styles['Title']))
    story.append(Spacer(1, 12))

    # Tenant Information
    story.append(Paragraph(f'Tenant Name: {tenant.tenant.first_name} {tenant.tenant.last_name}', styles['Normal']))
    story.append(Paragraph(f'Property: {tenant.property.name}', styles['Normal']))
    story.append(Paragraph(f'Lease Start Date: {tenant.lease_start.strftime("%Y-%m-%d")}', styles['Normal']))
    story.append(Paragraph(f'Lease End Date: {tenant.lease_end.strftime("%Y-%m-%d")}', styles['Normal']))
    story.append(Paragraph(f'Lease Status: {tenant.lease_status}', styles['Normal']))
    story.append(Spacer(1, 12))

    # Lease Terms
    story.append(Paragraph('Lease Terms and Conditions:', styles['Heading2']))
    story.append(Paragraph('1. The tenant agrees to rent the property described above from the landlord for the lease term specified.', styles['Normal']))
    story.append(Paragraph('2. The tenant shall pay the rent amount specified on the lease agreement by the due date.', styles['Normal']))
    story.append(Paragraph('3. The tenant shall maintain the property in good condition and notify the landlord of any issues.', styles['Normal']))
    story.append(Paragraph('4. The tenant agrees to abide by all terms and conditions specified in the lease agreement.', styles['Normal']))
    story.append(Spacer(1, 12))

    # Signature Section
    story.append(Paragraph('Signatures:', styles['Heading2']))
    story.append(Spacer(1, 12))

    signature_table_data = [
        ['Tenant Signature:', '_________________________'],
        ['Landlord Signature:', '_________________________'],
    ]

    signature_table = Table(signature_table_data)
    signature_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), '#d5a6a8'),
        ('TEXTCOLOR', (0, 0), (-1, 0), '#ffffff'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (-1, -1), '#f2f2f2'),
        ('GRID', (0, 0), (-1, -1), 1, '#000000')
    ]))

    story.append(signature_table)

    doc.build(story)
    pdf = buffer.getvalue()
    buffer.close()
    return pdf

def generate_lease_report(tenant):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    story.append(Paragraph(f'Lease Report for {tenant}', styles['Title']))
    
    # Tenant Information
    story.append(Paragraph(f'Tenant Name: {tenant.tenant.first_name} {tenant.tenant.last_name}', styles['Normal']))
    story.append(Paragraph(f'Property Leased: {tenant.property.name}', styles['Normal']))
    story.append(Paragraph(f'Lease Start: {tenant.lease_start.strftime("%Y-%m-%d")}', styles['Normal']))
    story.append(Paragraph(f'Lease End: {tenant.lease_end.strftime("%Y-%m-%d")}', styles['Normal']))
    story.append(Paragraph(f'Status: {tenant.lease_status}', styles['Normal']))
    story.append(Paragraph('<br/>', styles['Normal']))

    doc.build(story)
    pdf = buffer.getvalue()
    buffer.close()
    return pdf

def generate_tenant_properties_report(tenant):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph(f'Tenant Properties Report for {tenant.tenant.first_name} {tenant.tenant.last_name}', styles['Title']))
    
    # Properties Table
    properties = Property.objects.filter(properties_leased=tenant)
    data = [['Property Name', 'Type', 'Rent Amount', 'Status']]

    for prop in properties:
        data.append([prop.name, prop.property_type.property_type, prop.rent_amount, prop.status])

    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), '#d5a6a8'),
        ('TEXTCOLOR', (0, 0), (-1, 0), '#ffffff'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (-1, -1), '#f2f2f2'),
        ('GRID', (0, 0), (-1, -1), 1, '#000000')
    ]))

    story.append(table)

    doc.build(story)
    pdf = buffer.getvalue()
    buffer.close()
    return pdf



