import os
import sys
import csv
import json
import requests

from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators
from splunk import rest
import cs_utils

import logging
import logger_manager
logger = logger_manager.setup_logging('sophos_details_command', logging.INFO)

SOPHOS_AUTH_URL = 'https://id.sophos.com/api/v2/oauth2/token'
SOPHOS_WHOAMI_URL = 'https://api.central.sophos.com/whoami/v1'
SOPHOS_TENANT_FROM_ORGANIZATION_URL = "https://api.central.sophos.com/organization/v1/tenants?pageTotal=true"
SOPHOS_TENANT_FROM_ORGANIZATION_PAGINATION_URL = "https://api.central.sophos.com/organization/v1/tenants?page="
SOPHOS_TENANT_DICT = {}

@Configuration()
class SophosEndpointDetails(GeneratingCommand):

    ip               = Option(name="ip",require=False, default="")
    hostname         = Option(name="hostname",require=False,default="")
    uuid             = Option(name="uuid",require=False,default="")
    all_endpoints    = Option(name="all_endpoints",require=False,default=False)

    def get_client_details(self):

        _, serverContent = rest.simpleRequest("/servicesNS/nobody/{}/configs/conf-{}?output_mode=json".format(cs_utils.APP_NAME, cs_utils.CYENCES_CONF_FILE), sessionKey=self.session_key)

        data = json.loads(serverContent)['entry']
        client_id = ''
        client_secret = ''
        for i in data:
            if i['name'] == 'cs_sophos_endpoint':
                client_id = i['content']['client_id']
                client_secret = cs_utils.CredentialManager(self.session_key).get_credential(client_id)
                break
        return client_id,client_secret

    def get_barier_token(self,client_id,client_secret):
        header = {"Content-Type":"application/x-www-form-urlencoded"}
        data = {'client_id':client_id,'client_secret':client_secret,'grant_type':'client_credentials','scope':'token'}
        response = requests.post(SOPHOS_AUTH_URL, headers=header,data = data)

        response_json = response.json()
        if ("errorCode" in response_json and response_json['errorCode'] == 'success'):
            return response_json['access_token'] if "access_token" in response_json else None
        else:
            raise Exception("Error from sophos: {}".format(response_json))

    def get_tenant_from_organization(self,barier_token,organization_id):

        header = {"Authorization":"Bearer {}".format(barier_token),"X-Organization-ID":organization_id}
        response = requests.get(SOPHOS_TENANT_FROM_ORGANIZATION_URL, headers=header)

        if(response.status_code == 200):
            response_json = response.json()
            current_page = 1
            for i in response_json.get("items"):
                cs_utils.check_url_scheme(i.get('apiHost'), logger)
                SOPHOS_TENANT_DICT[i.get('id')] = i.get('apiHost')
            total_pages = response_json.get('pages').get('total')
            while current_page <= total_pages:
                current_page=current_page+1
                header = {"Authorization":"Bearer {}".format(barier_token),"X-Organization-ID":organization_id}
                response = requests.get(SOPHOS_TENANT_FROM_ORGANIZATION_PAGINATION_URL + str(current_page), headers=header)
                response_json = response.json()
                for i in response_json.get("items"):
                    cs_utils.check_url_scheme(i.get('apiHost'), logger)
                    SOPHOS_TENANT_DICT[i.get('id')] = i.get('apiHost')

        else:
            raise Exception("Error while fetching Tenant Details: {}".format(response.json()))


    def get_tenant_list(self,barier_token):

        header = {"Authorization":"Bearer {}".format(barier_token)}
        response = requests.get(SOPHOS_WHOAMI_URL, headers=header)

        if(response.status_code == 200):
            response_json = response.json()
            if(response_json.get("idType")=="tenant"):
                url = response_json.get("apiHosts").get("dataRegion")
                cs_utils.check_url_scheme(url, logger)
                SOPHOS_TENANT_DICT[response_json.get("id")] = url
            elif(response_json.get("idType")=="organization"):
                self.get_tenant_from_organization(barier_token,response_json.get("id"))
        else:
            raise Exception("Error while fetching Tenant Details, status_code: {}, response: {}".format(response.status_code, response.json()))

    def get_request_header(self,tenant,barier_token):
        requestHeaders = {
            "X-Tenant-ID": tenant,
            "Authorization": "Bearer "+ barier_token,
            "Accept": "application/json"
        }
        return requestHeaders

    def get_instance_uuid(self,barier_token,ip="",hostname="",uuid=""):
        
        try:
            list_of_uuid = []

            if(uuid!="" and uuid!=" "):
                for tenant in SOPHOS_TENANT_DICT:
                    requestHeaders = self.get_request_header(tenant,barier_token)
                    response = requests.get(SOPHOS_TENANT_DICT[tenant]+"/endpoint/v1/endpoints/"+str(uuid), headers=requestHeaders)
                    response_json = response.json()
                    if response.status_code == 200:
                        list_of_uuid.append(response_json)
                        return list_of_uuid
                    else:
                        logger.error("Error while fetching UUID of instance")

            elif(hostname!="" and ip!="" and hostname!=" " and ip!=" "):
                for tenant in SOPHOS_TENANT_DICT:
                    requestHeaders = self.get_request_header(tenant,barier_token)

                    response = requests.get(SOPHOS_TENANT_DICT[tenant]+"/endpoint/v1/endpoints?hostnameContains="+hostname+"ipAddresses="+ip, headers=requestHeaders)
                    response_json = response.json()
                    if response.status_code == 200:
                        for instance in response_json.get("items"):
                            list_of_uuid.append(instance)
                    else:
                        logger.error("Error while fetching UUID of instance")

            elif(ip!="" and ip!=" "):
                for tenant in SOPHOS_TENANT_DICT:
                    requestHeaders = self.get_request_header(tenant,barier_token)
                    response = requests.get(SOPHOS_TENANT_DICT[tenant]+"/endpoint/v1/endpoints?ipAddresses="+ip, headers=requestHeaders)
                    response_json = response.json()
                    if response.status_code == 200:
                        for instance in response_json.get("items"):
                            list_of_uuid.append(instance)
                    else:
                        logger.error("Error while fetching UUID of instance")


            elif(hostname!="" and hostname!=" "):
                for tenant in SOPHOS_TENANT_DICT:
                    requestHeaders = self.get_request_header(tenant,barier_token)
                    response = requests.get(SOPHOS_TENANT_DICT[tenant]+"/endpoint/v1/endpoints?hostnameContains="+hostname, headers=requestHeaders)
                    response_json = response.json()
                    if response.status_code == 200:
                        for instance in response_json.get("items"):
                            list_of_uuid.append(instance)
                    else:
                        raise Exception("Error while fetching UUID of instance")

            return list_of_uuid
        except Exception as e:
            logger.exception("Error while fetching Instance UUID : {}".format(e))



    def generate(self):
        try:
            self.session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)

            ip = self.ip
            hostname = self.hostname
            uuid = self.uuid
            all_endpoints = self.all_endpoints
            if(ip=="" and hostname=="" and uuid=="" and ip==" " and hostname==" " and uuid==" " and all_endpoints==False):
                raise Exception("Please provide IP or Hostname or UUID")


            # Read Client ID & Client Secret
            client_id,client_secret = self.get_client_details()

            if not client_id or not client_secret:
                raise Exception("Sophos Client ID or Client Secret or both not found in the cs_configurations.conf file.")

            barier_token = self.get_barier_token(client_id,client_secret)
            self.get_tenant_list(barier_token)

            if(all_endpoints):
                for tenant in SOPHOS_TENANT_DICT:
                    requestHeaders = self.get_request_header(tenant, barier_token)

                    current_page=1
                    total_page = 1
                    next_page_key = None
                    while(current_page<=total_page):
                        if(current_page==1):
                            params = {"pageTotal": "true"}
                        else:
                            params = {"pageFromKey": next_page_key}

                        response = requests.get(
                            SOPHOS_TENANT_DICT.get(tenant)+"/endpoint/v1/endpoints",
                            params=params,
                            headers=requestHeaders)

                        if(response.status_code!=200):
                            raise Exception("Error while fetching all the endpoints")
                        response_json = response.json()

                        if(current_page==1):
                            total_page = response_json.get("pages").get("total")
                            logger.debug("Total Page: {}".format(total_page))

                        logger.debug("Current Page: {}".format(current_page))
                        next_page_key = response_json.get("pages", {}).get("nextKey")

                        for item in response_json.get("items"):
                            yield {"_raw": item}

                        current_page = current_page + 1

            else:
                instance_details = self.get_instance_uuid(barier_token,ip,hostname,uuid)
                for instance in instance_details:
                    yield {"_raw": instance}
        except Exception as e:
            logger.exception("Error Occurred while fetching instance details. Error: {}".format(e))
            self.write_warning("Error Occurred while fetching instance details. Go to Inspect Job and check search logs")


dispatch(SophosEndpointDetails, sys.argv, sys.stdin, sys.stdout, __name__)
