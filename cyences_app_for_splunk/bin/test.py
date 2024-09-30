import requests
import os


API_ENDPOINT = "https://stg-backlist.crossrealms.com:10000/v1/ipinfo/199.45.154.152"

response = requests.get(
    API_ENDPOINT,
    auth=("admin", "c9de0d5af864f9450c0b"),
    verify=os.path.join(os.path.dirname(__file__), "blockshield_ca_cert.pem")
)
response.raise_for_status()
print(response.json())
