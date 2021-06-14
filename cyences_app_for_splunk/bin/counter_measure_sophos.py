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

    uuid_tanent      = Option(name="uuid_tanent",require=True)
    comment          = Option(name="comment",require=True)
    isolate          = Option(name="isolate",require=True,default=True)

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


    def isolate_instance(self,client_id,client_secret,uuid_tanent,comment,isolate=True):

        return_response = []
        barier_token = self.get_barier_token(client_id,client_secret)
        self.get_tenant_list(barier_token)

        list_of_uuid_tanent = uuid_tanent.split(",")
        for i in list_of_uuid_tanent:
            uuid_tanent = i.split("$$$$")
            requestUrl = SOPHOS_TENANT_DICT.get(uuid_tanent[1])+"/endpoint/v1/endpoints/isolation"
            requestBody = {
                "enabled": isolate,
                "ids": [uuid_tanent[0]],
                "comment": "Isolation from Splunk : " + comment
            }
            requestHeaders = {
                "Authorization": "Bearer {}".format(barier_token),
                "Accept": "application/json",
                "Content-Type": "application/json"
            }

            response = requests.post(requestUrl, headers=requestHeaders, json=requestBody)
            if(response.status_code==200):
                return_response.append({"id":uuid_tanent[0],"tanent_id":uuid_tanent[1],"status":"successfully isolated"})
            else:
                return_response.append({"id":uuid_tanent[0],"tanent_id":uuid_tanent[1],"status":"Error while isolating : {}".format(response.text)})
        return return_response

    def generate(self):

        uuid_tanent = self.uuid_tanent
        comment = self.comment
        isolate = self.isolate

        if(uuid_tanent==""):
            self.logger.error("Please provide required parameter")
            exit()

        # Read Client ID & Client Secret
        client_id,client_secret = self.get_client_details()

        if not client_id or not client_secret:
            self.logger.error("Sophos Client ID or Client Secret or both not found in the cs_configurations.conf file.")
        else:
            response = self.isolate_instance(client_id,client_secret,uuid_tanent,comment,isolate)   

        for i in response:
            yield i
        
 
dispatch(CounterMeasurePaloAlto, sys.argv, sys.stdin, sys.stdout, __name__)