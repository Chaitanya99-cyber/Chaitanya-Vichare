"""
Email Service using SMTP
Sends email notifications for contact form submissions
"""
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

# Email configuration from environment
SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USERNAME = os.environ.get("SMTP_USERNAME")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")
SMTP_FROM_EMAIL = os.environ.get("SMTP_FROM_EMAIL")
SMTP_FROM_NAME = os.environ.get("SMTP_FROM_NAME", "GRC Portfolio")

def send_contact_notification(contact_data: dict) -> bool:
    """
    Send email notification when contact form is submitted
    
    Args:
        contact_data: Dictionary containing name, email, phone, company, message
        
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"New Contact Form Submission from {contact_data.get('name', 'Unknown')}"
        msg['From'] = f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL}>"
        msg['To'] = SMTP_FROM_EMAIL
        msg['Reply-To'] = contact_data.get('email', '')
        
        # Create HTML email body
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); 
                           color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }}
                .field {{ margin-bottom: 20px; }}
                .label {{ font-weight: bold; color: #6366f1; margin-bottom: 5px; }}
                .value {{ background: white; padding: 10px; border-radius: 4px; 
                          border-left: 3px solid #6366f1; }}
                .message-box {{ background: white; padding: 15px; border-radius: 4px;
                                border-left: 3px solid #8b5cf6; min-height: 100px; }}
                .footer {{ text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2 style="margin: 0;">🔔 New Contact Form Submission</h2>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">
                        Received on {datetime.utcnow().strftime('%B %d, %Y at %I:%M %p UTC')}
                    </p>
                </div>
                
                <div class="content">
                    <div class="field">
                        <div class="label">👤 Name</div>
                        <div class="value">{contact_data.get('name', 'N/A')}</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">📧 Email</div>
                        <div class="value">
                            <a href="mailto:{contact_data.get('email', '')}" 
                               style="color: #6366f1; text-decoration: none;">
                                {contact_data.get('email', 'N/A')}
                            </a>
                        </div>
                    </div>
                    
                    {f'''
                    <div class="field">
                        <div class="label">📱 Phone</div>
                        <div class="value">{contact_data.get('phone', 'N/A')}</div>
                    </div>
                    ''' if contact_data.get('phone') else ''}
                    
                    {f'''
                    <div class="field">
                        <div class="label">🏢 Company</div>
                        <div class="value">{contact_data.get('company', 'N/A')}</div>
                    </div>
                    ''' if contact_data.get('company') else ''}
                    
                    <div class="field">
                        <div class="label">💬 Message</div>
                        <div class="message-box">{contact_data.get('message', 'N/A')}</div>
                    </div>
                    
                    <div style="margin-top: 30px; padding: 15px; background: #e0e7ff; 
                                border-radius: 4px; text-align: center;">
                        <p style="margin: 0; color: #4f46e5;">
                            <strong>Quick Action:</strong> Reply directly to this email to respond to the inquiry
                        </p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>This email was sent from your GRC Portfolio contact form</p>
                    <p>View all messages in your <a href="#" style="color: #6366f1;">Admin Panel</a></p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Create plain text alternative
        text_body = f"""
        New Contact Form Submission
        ===========================
        
        Received on: {datetime.utcnow().strftime('%B %d, %Y at %I:%M %p UTC')}
        
        Name: {contact_data.get('name', 'N/A')}
        Email: {contact_data.get('email', 'N/A')}
        Phone: {contact_data.get('phone', 'N/A')}
        Company: {contact_data.get('company', 'N/A')}
        
        Message:
        {contact_data.get('message', 'N/A')}
        
        ---
        Reply directly to this email to respond to the inquiry.
        """
        
        # Attach both HTML and plain text versions
        part1 = MIMEText(text_body, 'plain')
        part2 = MIMEText(html_body, 'html')
        msg.attach(part1)
        msg.attach(part2)
        
        # Send email
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()  # Secure the connection
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        
        logger.info(f"Email notification sent successfully for contact from {contact_data.get('email')}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email notification: {str(e)}")
        return False

def send_test_email() -> bool:
    """Send a test email to verify SMTP configuration"""
    try:
        msg = MIMEMultipart()
        msg['Subject'] = "Test Email - GRC Portfolio Backend"
        msg['From'] = f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL}>"
        msg['To'] = SMTP_FROM_EMAIL
        
        body = """
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #6366f1;">✅ SMTP Configuration Successful!</h2>
            <p>Your email notification system is working correctly.</p>
            <p>You will now receive notifications when someone submits the contact form on your website.</p>
            <hr>
            <p style="color: #6b7280; font-size: 12px;">
                This is a test email from your GRC Portfolio backend.
            </p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        
        logger.info("Test email sent successfully")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send test email: {str(e)}")
        return False
