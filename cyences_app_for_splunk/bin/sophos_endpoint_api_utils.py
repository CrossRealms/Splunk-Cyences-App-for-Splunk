import os
import sys
import csv
import json
import requests

from splunk import rest
import cs_utils


APP_NAME = 'cyences_app_for_splunk'
CONF_FILE = 'cs_configurations'
SOPHOS_AUTH_URL = 'https://id.sophos.com/api/v2/oauth2/token'
SOPHOS_WHOAMI_URL = 'https://api.central.sophos.com/whoami/v1'
SOPHOS_TENANT_FROM_ORGANIZATION_URL = "https://api.central.sophos.com/organization/v1/tenants?pageTotal=true"
SOPHOS_TENANT_FROM_ORGANIZATION_PAGINATION_URL = "https://api.central.sophos.com/organization/v1/tenants?page="

SOPHOS_ENDPOINT_ISOLATION = "https://api-{dataRegion}.central.sophos.com/endpoint/v1/endpoints/{endpointId}/isolation"


class SophosAPIUtils:

    def __init__(self, logger, session_key, client_id=None, client_secret=None):
        self.logger = logger
        self.session_key = session_key
        self.sophos_tenant_dict = {}

        if not client_id and not client_secret:
            # Read Client ID & Client Secret from file
            client_id, client_secret = self.get_client_details()

        if not client_id or not client_secret:
            raise Exception("Sophos Client ID or Client Secret or both not found in the cs_configurations.conf file.")

        self.barier_token = self.get_barier_token(client_id,client_secret)
        self.generate_tenant_list()



    def get_client_details(self):
        _, serverContent = rest.simpleRequest("/servicesNS/nobody/{}/configs/conf-{}?output_mode=json".format(APP_NAME,CONF_FILE), sessionKey=self.session_key)
        data = json.loads(serverContent)['entry']
        client_id = ''
        client_secret = ''
        for i in data:
            if i['name'] == 'cs_sophos_endpoint':
                client_id = i['content']['client_id']
                client_secret = cs_utils.CredentialManager(self.session_key).get_credential(client_id)
                break
        return client_id,client_secret


    def get_barier_token(self, client_id, client_secret):
        header = {"Content-Type":"application/x-www-form-urlencoded"}
        data = {'client_id':client_id, 'client_secret':client_secret, 'grant_type':'client_credentials', 'scope':'token'}
        response = requests.post(SOPHOS_AUTH_URL, headers=header, data = data)

        response_json = response.json()
        if response_json.get('errorCode')=='success':
            return response_json.get('access_token')
        else:
            raise Exception("Error from sophos: {}".format(response_json))


    def get_tenant_from_organization(self, organization_id):

        header = {"Authorization":"Bearer {}".format(self.barier_token), "X-Organization-ID":organization_id}
        response = requests.get(SOPHOS_TENANT_FROM_ORGANIZATION_URL, headers=header)

        if response.ok:
            response_json = response.json()
            current_page = 1

            for i in response_json.get("items"):
                cs_utils.check_url_scheme(i.get('apiHost'), self.logger)
                self.sophos_tenant_dict[i.get('id')] = i.get('apiHost')

            total_pages = response_json.get('pages').get('total')

            while current_page <= total_pages:
                current_page=current_page+1
                header = {"Authorization": "Bearer {}".format(self.barier_token), "X-Organization-ID": organization_id}
                response = requests.get(SOPHOS_TENANT_FROM_ORGANIZATION_PAGINATION_URL + str(current_page), headers=header)
                response_json = response.json()

                for i in response_json.get("items"):
                    cs_utils.check_url_scheme(i.get('apiHost'), self.logger)
                    self.sophos_tenant_dict[i.get('id')] = i.get('apiHost')
        else:
            raise Exception("Error while fetching Tenant Details: {}".format(response.json()))

    def get_who_am_i(self):
        header = {"Authorization":"Bearer {}".format(self.barier_token)}
        response = requests.get(SOPHOS_WHOAMI_URL, headers=header)

        if response.ok:
            response_json = response.json()
            self.logger.info("REMOVE_THIS: who am I: {}".format(response_json))
            return response_json
        else:
            raise Exception("Error while fetching Tenant Details: {}".format(response.json()))


    def generate_tenant_list(self):
        response_json = self.get_who_am_i()

        if response_json.get("idType")=="tenant":
            url = response_json.get("apiHosts").get("dataRegion")
            cs_utils.check_url_scheme(url, self.logger)
            self.sophos_tenant_dict[response_json.get("id")] = url

        elif response_json.get("idType")=="organization":
            self.get_tenant_from_organization(response_json.get("id"))


    def get_request_header(self, tenant):
        requestHeaders = {
            "X-Tenant-ID": tenant,
            "Authorization": "Bearer "+ self.barier_token,
            "Accept": "application/json"
        }
        return requestHeaders


    def get_instance_details(self, ip="", hostname="", uuid=""):
        try:
            if uuid!="" and uuid!=" ":
                for tenant in self.sophos_tenant_dict:
                    requestHeaders = self.get_request_header(tenant)
                    response = requests.get(self.sophos_tenant_dict[tenant]+"/endpoint/v1/endpoints/"+str(uuid), headers=requestHeaders)

                    if response.ok:
                        yield response.json()
                    else:
                        self.logger.error("Error while fetching UUID of instance")


            # TODO - Need to handle below without if else ladder
            elif hostname!="" and ip!="" and hostname!=" " and ip!=" ":
                for tenant in self.sophos_tenant_dict:
                    requestHeaders = self.get_request_header(tenant)
                    response = requests.get(self.sophos_tenant_dict[tenant]+"/endpoint/v1/endpoints?hostnameContains="+hostname+"ipAddresses="+ip, headers=requestHeaders)
                    # TODO - bug in the above line

                    if response.ok:
                        response_json = response.json()
                        for instance in response_json.get("items"):
                            yield instance
                    else:
                        self.logger.error("Error while fetching UUID of instance")

            elif ip!="" and ip!=" ":
                for tenant in self.sophos_tenant_dict:
                    requestHeaders = self.get_request_header(tenant)
                    response = requests.get(self.sophos_tenant_dict[tenant]+"/endpoint/v1/endpoints?ipAddresses="+ip, headers=requestHeaders)
                    response_json = response.json()
                    if response.status_code == 200:
                        for instance in response_json.get("items"):
                            yield instance
                    else:
                        self.logger.error("Error while fetching UUID of instance")

            elif hostname!="" and hostname!=" ":
                for tenant in self.sophos_tenant_dict:
                    requestHeaders = self.get_request_header(tenant)
                    response = requests.get(self.sophos_tenant_dict[tenant]+"/endpoint/v1/endpoints?hostnameContains="+hostname, headers=requestHeaders)
                    response_json = response.json()
                    if response.status_code == 200:
                        for instance in response_json.get("items"):
                            yield instance
                    else:
                        raise Exception("Error while fetching UUID of instance")

        except Exception as e:
            self.logger.exception("Error while fetching Instance UUID : {}".format(e))
    
    
    def get_all_endpoint_details(self):
        for tenant in self.sophos_tenant_dict:
            current_page=1
            total_page = 1
            while current_page <= total_page:
                requestHeaders = self.get_request_header(tenant)
                
                if current_page==1:
                    requestUrl = self.sophos_tenant_dict.get(tenant)+"/endpoint/v1/endpoints?pageTotal=true"
                else:
                    requestUrl = self.sophos_tenant_dict.get(tenant)+"/endpoint/v1/endpoints?page="+str(current_page)
                
                request = requests.get(requestUrl, headers=requestHeaders)
                if not request.ok:
                    raise Exception("Error while fetching all the endpoints")
                request_json = request.json()

                if current_page==1:
                    total_page = request_json.get("pages").get("total")

                for item in request_json.get("items"):
                    yield item

                current_page = current_page + 1
