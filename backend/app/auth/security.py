from passlib.hash import bcrypt
from datetime import datetime, timedelta
from jose import jwt
import os
import secrets

SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
ALGORITHM = "HS256"


def hash_password(password: str):
    return bcrypt.hash(password[:72])


def verify_password(plain, hashed):
    return bcrypt.verify(plain[:72], hashed)


def create_access_token(data: dict):
    to_encode = data.copy()
    to_encode.update({
        "exp": datetime.utcnow() + timedelta(hours=2)
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def generate_verification_token() -> str:
    """Generate a secure random token for email verification."""
    return secrets.token_urlsafe(32)


def generate_reset_token() -> str:
    """Generate a secure random token for password reset."""
    return secrets.token_urlsafe(32)