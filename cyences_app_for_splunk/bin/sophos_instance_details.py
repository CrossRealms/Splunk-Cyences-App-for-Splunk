import os
import sys
import csv
import json
import requests

from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators
from splunk import rest
import cs_utils

CONF_FILE = 'cs_configurations'
SOPHOS_AUTH_URL = 'https://id.sophos.com/api/v2/oauth2/token'
SOPHOS_WHOAMI_URL = 'https://api.central.sophos.com/whoami/v1'
SOPHOS_TENANT_FROM_ORGANIZATION_URL = "https://api.central.sophos.com/organization/v1/tenants?pageTotal=true"
SOPHOS_TENANT_FROM_ORGANIZATION_PAGINATION_URL = "https://api.central.sophos.com/organization/v1/tenants?page="
SOPHOS_TENANT_DICT = {}

@Configuration()
class CounterMeasurePaloAlto(GeneratingCommand):

    ip               = Option(name="ip",require=False, default="",validate=validators.RegularExpression("^[^\*]*$"))
    hostname         = Option(name="hostname",require=False,default="",validate=validators.RegularExpression("^[^\*]*$"))
    uuid             = Option(name="uuid",require=False,default="",validate=validators.RegularExpression("^[^\*]*$"))
    all_endpoints    = Option(name="all_endpoints",require=False,default=False,validate=validators.Boolean())
    
    def get_client_details(self):
        sessionKey = self.search_results_info.auth_token
        _, serverContent = rest.simpleRequest("/servicesNS/nobody/cyences_app_for_splunk/configs/conf-{}?output_mode=json".format(CONF_FILE), sessionKey=sessionKey)
        data = json.loads(serverContent)['entry']
        client_id = ''
        client_secret = ''
        for i in data:
            if i['name'] == 'countermeasure_sophos':
                client_id = i['content']['client_id']
                client_secret = cs_utils.CredentialManager(sessionKey).get_credential(client_id)
                break
        return client_id,client_secret

    def get_barier_token(self,client_id,client_secret):
        header = {"Content-Type":"application/x-www-form-urlencoded"}
        data = {'client_id':client_id,'client_secret':client_secret,'grant_type':'client_credentials','scope':'token'}
        response = requests.post(SOPHOS_AUTH_URL, headers=header,data = data)

        response_json = response.json()
        if(response_json.get('errorCode')=='success'):
            return response_json.get('access_token')
        else:
            self.logger.error("Error while fetching bearier Token : {}".format(response_json))
            exit()

    def get_tenant_from_organization(self,barier_token,organization_id):

        header = {"Authorization":"Bearer {}".format(barier_token),"X-Organization-ID":organization_id}
        response = requests.get(SOPHOS_TENANT_FROM_ORGANIZATION_URL, headers=header)

        if(response.status_code == 200):
            response_json = response.json()
            current_page = 1
            for i in response_json.get("items"):
                SOPHOS_TENANT_DICT[i.get('id')] = i.get('apiHost')
            total_pages = response_json.get('pages').get('total')
            while current_page <= total_pages:
                current_page=current_page+1
                header = {"Authorization":"Bearer {}".format(barier_token),"X-Organization-ID":organization_id}
                response = requests.get(SOPHOS_TENANT_FROM_ORGANIZATION_PAGINATION_URL + str(current_page), headers=header)
                response_json = response.json()
                for i in response_json.get("items"):
                    SOPHOS_TENANT_DICT[i.get('id')] = i.get('apiHost')

        else:
            self.logger.error("Error while fetching Tenant Details: {}".format(response.json()))
            exit()


    def get_tenant_list(self,barier_token):

        header = {"Authorization":"Bearer {}".format(barier_token)}
        response = requests.get(SOPHOS_WHOAMI_URL, headers=header)

        if(response.status_code == 200):
            response_json = response.json()
            if(response_json.get("idType")=="tenant"):
                SOPHOS_TENANT_DICT[response_json.get("id")] = response_json.get("apiHosts").get("dataRegion")
            elif(response_json.get("idType")=="organization"):
                self.get_tenant_from_organization(barier_token,response_json.get("id"))
        else:
            self.logger.error("Error while fetching Tenant Details: {}".format(response.json()))


    def get_instance_uuid(self,barier_token,ip="",hostname="",uuid=""):
        
        try:
            list_of_uuid = []

            if(uuid!="" and uuid!=" "):
                for tenant in SOPHOS_TENANT_DICT:
                    requestHeaders = {
                        "X-Tenant-ID": tenant,
                        "Authorization": "Bearer "+ barier_token,
                        "Accept": "application/json"
                    }
                    response = requests.get(SOPHOS_TENANT_DICT[tenant]+"/endpoint/v1/endpoints/"+str(uuid), headers=requestHeaders)
                    response_json = response.json()
                    if response.status_code == 200:
                        list_of_uuid.append(response_json)
                        return list_of_uuid
                    else:
                        self.logger.error("Error while fetching UUID of instance")

            elif(hostname!="" and ip!="" and hostname!=" " and ip!=" "):
                for tenant in SOPHOS_TENANT_DICT:
                    requestHeaders = {
                        "X-Tenant-ID": tenant,
                        "Authorization": "Bearer "+ barier_token,
                        "Accept": "application/json"
                    }
                    response = requests.get(SOPHOS_TENANT_DICT[tenant]+"/endpoint/v1/endpoints?hostnameContains="+hostname+"ipAddresses="+ip, headers=requestHeaders)
                    response_json = response.json()
                    if response.status_code == 200:
                        for instance in response_json.get("items"):
                            list_of_uuid.append(instance)
                    else:
                        self.logger.error("Error while fetching UUID of instance")

            elif(ip!="" and ip!=" "):
                for tenant in SOPHOS_TENANT_DICT:
                    requestHeaders = {
                        "X-Tenant-ID": tenant,
                        "Authorization": "Bearer "+ barier_token,
                        "Accept": "application/json"
                    }
                    response = requests.get(SOPHOS_TENANT_DICT[tenant]+"/endpoint/v1/endpoints?ipAddresses="+ip, headers=requestHeaders)
                    response_json = response.json()
                    if response.status_code == 200:
                        for instance in response_json.get("items"):
                            list_of_uuid.append(instance)
                    else:
                        self.logger.error("Error while fetching UUID of instance")


            elif(hostname!="" and hostname!=" "):
                for tenant in SOPHOS_TENANT_DICT:
                    requestHeaders = {
                        "X-Tenant-ID": tenant,
                        "Authorization": "Bearer "+ barier_token,
                        "Accept": "application/json"
                    }
                    response = requests.get(SOPHOS_TENANT_DICT[tenant]+"/endpoint/v1/endpoints?hostnameContains="+hostname, headers=requestHeaders)
                    response_json = response.json()
                    if response.status_code == 200:
                        for instance in response_json.get("items"):
                            list_of_uuid.append(instance)
                    else:
                        self.logger.error("Error while fetching UUID of instance")

            return list_of_uuid
        except Exception as e:
            self.logger.error("Error while fetching Instance UUID : {}".format(e))



    def generate(self):

        ip = self.ip
        hostname = self.hostname
        uuid = self.uuid
        all_endpoints = self.all_endpoints
        if(ip=="" and hostname=="" and uuid=="" and ip==" " and hostname==" " and uuid==" " and all_endpoints==False):
            self.logger.error("Please provide IP or Hostname or UUID")
            exit()

        # Read Client ID & Client Secret
        client_id,client_secret = self.get_client_details()

        if not client_id or not client_secret:
            self.logger.error("Sophos Client ID or Client Secret or both not found in the cs_configurations.conf file.")
        else:
            barier_token = self.get_barier_token(client_id,client_secret)
            self.get_tenant_list(barier_token)

            if(all_endpoints):
                for i in SOPHOS_TENANT_DICT:

                    current_page=1
                    total_page = 1
                    while(current_page<=total_page):
                        requestHeaders = {
                            "X-Tenant-ID": i,
                            "Authorization": "Bearer "+ barier_token,
                            "Accept": "application/json"
                        }
                        if(current_page==1):
                            requestUrl = SOPHOS_TENANT_DICT.get(i)+"/endpoint/v1/endpoints?pageTotal=true"
                        else:
                            requestUrl =  SOPHOS_TENANT_DICT.get(i)+"/endpoint/v1/endpoints?page="+str(current_page)
                        request = requests.get(requestUrl, headers=requestHeaders)
                        if(request.status_code!=200):
                            self.logger.error("Error while fetching all the endpoints")
                            exit()
                        request_json = request.json()

                        if(current_page==1):
                            total_page = request_json.get("pages").get("total")

                        for i in request_json.get("items"):
                            yield i
                        
                        current_page = current_page + 1

            else:
                instance_details = self.get_instance_uuid(barier_token,ip,hostname,uuid)
                for i in instance_details:
                    yield i

        
 
dispatch(CounterMeasurePaloAlto, sys.argv, sys.stdin, sys.stdout, __name__)