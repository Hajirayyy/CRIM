import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

MAIL_USERNAME = os.getenv("MAIL_USERNAME")       # your Gmail address
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")       # Gmail App Password (not your real password)
MAIL_FROM = os.getenv("MAIL_FROM", MAIL_USERNAME)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


def _send_email(to_email: str, subject: str, html_body: str):
    """
    Internal helper — sends a single HTML email via Gmail SMTP.
    Uses TLS on port 587. Raises on failure so the caller can handle it.
    """
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = MAIL_FROM
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.ehlo()
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_FROM, to_email, msg.as_string())


def send_verification_email(to_email: str, token: str):
    """
    Sends the account-confirmation email.
    The link points to /verify-email?token=<token> on the frontend,
    which then calls the backend to mark the account as verified.
    """
    link = f"{FRONTEND_URL}/verify-email?token={token}"
    html = f"""
    <div style="font-family:'Segoe UI',sans-serif;background:#050505;padding:40px;color:#e8e9f0;max-width:520px;margin:auto;border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
      <h1 style="color:#a3e635;font-size:22px;letter-spacing:2px;margin-bottom:8px;">CRIM</h1>
      <h2 style="color:#ffffff;font-size:18px;margin-bottom:16px;">Confirm your email address</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.6;">
        Thanks for signing up! Click the button below to verify your email and activate your account.
        This link expires in <strong style="color:#e8e9f0;">24 hours</strong>.
      </p>
      <a href="{link}"
         style="display:inline-block;margin-top:24px;padding:13px 28px;background:#a3e635;color:#0a0a0a;
                text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;letter-spacing:0.3px;">
        Verify Email →
      </a>
      <p style="margin-top:28px;color:rgba(255,255,255,0.25);font-size:12px;">
        If you didn't create a CRIM account, you can safely ignore this email.
      </p>
    </div>
    """
    _send_email(to_email, "Verify your CRIM account", html)


def send_password_reset_email(to_email: str, token: str):
    """
    Sends the password-reset email.
    The link points to /reset-password?token=<token> on the frontend.
    """
    link = f"{FRONTEND_URL}/reset-password?token={token}"
    html = f"""
    <div style="font-family:'Segoe UI',sans-serif;background:#050505;padding:40px;color:#e8e9f0;max-width:520px;margin:auto;border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
      <h1 style="color:#a3e635;font-size:22px;letter-spacing:2px;margin-bottom:8px;">CRIM</h1>
      <h2 style="color:#ffffff;font-size:18px;margin-bottom:16px;">Reset your password</h2>
      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.6;">
        We received a request to reset your password. Click below to choose a new one.
        This link expires in <strong style="color:#e8e9f0;">1 hour</strong>.
      </p>
      <a href="{link}"
         style="display:inline-block;margin-top:24px;padding:13px 28px;background:#a3e635;color:#0a0a0a;
                text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;letter-spacing:0.3px;">
        Reset Password →
      </a>
      <p style="margin-top:28px;color:rgba(255,255,255,0.25);font-size:12px;">
        If you didn't request a password reset, you can safely ignore this email.
      </p>
    </div>
    """
    _send_email(to_email, f"CRIM Password Reset – {token[:6]}", html)