from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

router = APIRouter()

MAIL_USERNAME = os.getenv("MAIL_USERNAME", "crim.app.dev@gmail.com")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "mocdcsspimawdtcm")

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

@router.post("/contact")
def send_contact_email(form: ContactForm):
    try:
        msg = MIMEMultipart()
        msg["From"]    = MAIL_USERNAME
        msg["To"]      = MAIL_USERNAME          # sends to yourself
        msg["Subject"] = f"[CRIM] Message from {form.name}"

        body = f"""
New contact form submission:

Name:    {form.name}
Email:   {form.email}
Message: {form.message}
        """
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(MAIL_USERNAME, MAIL_PASSWORD)
            server.sendmail(MAIL_USERNAME, MAIL_USERNAME, msg.as_string())

        return {"message": "Email sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))