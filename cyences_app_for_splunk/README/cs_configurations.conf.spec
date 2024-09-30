[honeydb]
# HoneyDB information to update Blocked IP lookup dynamically
api_id = <string> Honey DB API ID
api_key = <string> Honey DB API Key

[maliciousip]
# MaliciousIP Collector Configuration, 
api_url = <string> URL where the API is hosted to collect the data
auth_token = <string> API auth token
cust_id = <string> UUID generated automatically while Configuration

[product_config]
enabled_products = <string> comma separated list of enabled products
disabled_products = <string> comma separated list of disabled products

[blockshield]
# blockshield information to fetch ipinfo
username = <string> blockshield username
password = <string> blockshield password