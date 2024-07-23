import requests
from django.conf import settings
from requests.auth import HTTPBasicAuth
import base64
from datetime import datetime

class MpesaClient:
    def __init__(self):
        self.consumer_key = settings.MPESA_CONSUMER_KEY
        self.consumer_secret = settings.MPESA_CONSUMER_SECRET
        self.shortcode = settings.MPESA_SHORTCODE
        self.passkey = settings.MPESA_PASSKEY
        self.env = settings.MPESA_ENVIRONMENT
        self.api_url = "https://sandbox.safaricom.co.ke" if self.env == "sandbox" else "https://api.safaricom.co.ke"

    def authenticate(self):
        auth_url = f"{self.api_url}/oauth/v1/generate?grant_type=client_credentials"
        response = requests.get(auth_url, auth=HTTPBasicAuth(self.consumer_key, self.consumer_secret))
        if response.status_code == 200:
            return response.json()['access_token']
        return None

    def lipa_na_mpesa_online(self, amount, phone_number, account_reference, transaction_desc):
        access_token = self.authenticate()
        if access_token:
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            password = base64.b64encode(f"{self.shortcode}{self.passkey}{timestamp}".encode('ascii')).decode('utf-8')
            headers = {"Authorization": f"Bearer {access_token}"}
            payload = {
                "BusinessShortCode": self.shortcode,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phone_number,
                "PartyB": self.shortcode,
                "PhoneNumber": 254745412316,
                "CallBackURL": settings.MPESA_CALLBACK_URL,
                "AccountReference": account_reference,
                "TransactionDesc": transaction_desc
            }
            response = requests.post(f"{self.api_url}/mpesa/stkpush/v1/processrequest", json=payload, headers=headers)
            return response.json()
        return None

    def handle_callback(self, callback_data):
        pass
