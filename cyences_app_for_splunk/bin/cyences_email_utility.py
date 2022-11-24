
import os
import sys
import json
import socket
import re
import copy

from splunk import rest
from splunk.util import normalizeBoolean
import splunk.ssl_context as ssl_context
import splunk.secure_smtplib as secure_smtplib
from mako import template
import mako.filters as filters

from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from smtplib import SMTPNotSupportedError

import cs_utils


CHARSET = "UTF-8"
EMAIL_DELIM = re.compile('\s*[,;]\s*')


class CyencesEmailHTMLBodyBuilder:

    @staticmethod
    def htmlTableTemplate():
        return template.Template('''
            % if len(results) > 0:
            <div style="margin:0">
                <div style="overflow: auto; width: 100%;">
                    <h3 style="margin-top: 5px;">${title}</h3>
                    <table cellpadding="0" cellspacing="0" border="0" class="results" style="margin: 20px;">
                        <tbody>
                            <% cols = [] %>
                            <tr>
                            % for key,val in results[0].items():
                                % if not key.startswith("_") or key == "_raw" or key == "_time":
                                    <% cols.append(key) %>
                                    <th style="text-align: left; padding: 4px 8px; margin-bottom: 0px; border-bottom: 1px dotted #c3cbd4;">${key|h}</th>
                                % endif
                            % endfor
                            </tr>
                            % for result in results:
                                <tr valign="top">
                                % for col in cols:
                                    <td style="text-align: left; padding: 4px 8px; margin-top: 0px; margin-bottom: 0px; border-bottom: 1px dotted #c3cbd4;">
                                        % if isinstance(result.get(col), list):
                                            % for val in result.get(col):
                                                <pre style="font-family: helvetica, arial, sans-serif; white-space: pre-wrap; margin:0px;">${val|h}</pre>
                                            % endfor
                                        % else:
                                            <pre style="font-family: helvetica, arial, sans-serif; white-space: pre-wrap; margin:0px;">${result.get(col)|h}</pre>
                                        % endif
                                    </td>
                                % endfor
                                </tr>
                            % endfor
                        </tbody>
                    </table>
                </div>
            </div>
            % else:
                    <div class="results" style="margin: 20px;">No results found.</div>
            % endif
            ''')

    @staticmethod
    def htmlRootTemplate():
        return template.Template('''
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                </head>
                <body style="font-size: 14px; font-family: helvetica, arial, sans-serif; padding: 20px 0; margin: 0; color: #333;">
                    ${body}
                    <br>
                    ${footer}
                </body>
            </html>
                ''')

    @staticmethod
    def htmlFooterTemplate():
        return template.Template('''
            <div style="margin-top: 10px; border-top: 1px solid #c3cbd4;"></div>
            <% footerEscaped = filters.html_entities_escape(footer) %>
            <% footerBreaks = re.sub(r'\\r\\n?|\\n', '<br>', footerEscaped) %>
            <p style="margin: 20px; font-size: 11px; color: #999;">${footerBreaks}</p>
            ''')




class CyencesEmailUtility:
    def __init__(self, logger, session_key, alert_name=None) -> None:
        self.logger = logger
        self.session_key = session_key
        
        self.emailConfigs = self.get_default_email_configs()
        self.originalEmailConfigs = copy.deepcopy(self.emailConfigs)

        if alert_name:
            try:
                alert_level_email_configs = self.savedsearch_level_overridden_email_configs(alert_name)
                self.update_email_configs(alert_level_email_configs)
            except Exception as e:
                self.logger.error('Unable to find the alert \"{}\", hence skipping the custom email configuration from savedsearches.conf'.format(alert_name))
                self.logger.exception(e)

        self.fix_default_email_configs()
        self.logger.info("Final email configs after fix: {}".format(self.emailConfigs))

        self.set_smtp_creds()


    def get_default_email_configs(self):
        _, serverContent = rest.simpleRequest(
            "/services/configs/conf-alert_actions/email?output_mode=json",
            method='GET', sessionKey=self.session_key, raiseAllErrors=True)

        default_configs = json.loads(serverContent)
        default_configs = default_configs['entry'][0]['content']
        self.logger.debug("alert_actions/email config: {}".format(default_configs))

        return default_configs


    def savedsearch_level_overridden_email_configs(self, alert_name):
        _, serverContent = rest.simpleRequest(
            "/servicesNS/-/{}/saved/searches/{}?output_mode=json".format(cs_utils.APP_NAME, alert_name),
            method='GET', sessionKey=self.session_key, raiseAllErrors=True)

        alert_all_configs = json.loads(serverContent)
        alert_all_configs = alert_all_configs['entry'][0]['content']

        self.alert_all_configs = copy.deepcopy(alert_all_configs)

        self.logger.debug("saved/searches/<alert> all_config: {}".format(alert_all_configs))

        # keeping only action.email related config with parameter names only
        alert_email_config = {}
        for key, value in alert_all_configs.items():
            if key.startswith('action.email.') and key.lstrip('action.email.')!='':
                alert_email_config[key.lstrip('action.email.')] = value

        self.logger.debug("alert level email settings: {}".format(alert_email_config))

        return alert_email_config
    

    def update_email_configs(self, config_to_override):
        self.emailConfigs.update(config_to_override)


    def fix_default_email_configs(self):
        sender = self.emailConfigs['from']

        # make sure the sender is a valid email address
        if sender.find("@") == -1:
            sender = sender + '@' + socket.gethostname()
            if sender.endswith("@"):
                sender = sender + 'localhost'
        self.emailConfigs['from'] = sender
        
        self.emailConfigs['use_ssl'] = normalizeBoolean(self.emailConfigs['use_ssl'])
        self.emailConfigs['use_tls'] = normalizeBoolean(self.emailConfigs['use_tls'])
        self.emailConfigs['allowedDomainList'] = self.emailConfigs['allowedDomainList'].strip()


    def buildEmailHeaders(self, email, to, cc, bcc, subject):
        email['From'] = self.emailConfigs['from']

        email['Subject'] = Header(subject, CHARSET)

        recipients = []

        if to:
            email['To'] = ','.join(to)
            email.replace_header('To', email['To'])
            recipients.extend(to)
        if cc:
            email['Cc'] = ','.join(cc)
            email.replace_header('Cc', email['Cc'])
            recipients.extend(cc)
        if bcc:
            recipients.extend(bcc)
            del email['Bcc']    # delete bcc from header after adding to recipients
        
        self.recipients = recipients


    def set_smtp_creds(self):
        username = self.emailConfigs.get("username" , "")
        password = self.emailConfigs.get("password" , "")

        # fetch credentials from the endpoint if none are supplied or password is encrypted
        if (len(username) == 0 and len(password) == 0) or (password.startswith('$1$') or password.startswith('$7$')) :
            username, password = self._get_smtp_creds_util()
            self.emailConfigs['username'] = username
            self.emailConfigs['password'] = password


    def _get_smtp_creds_util(self):
        try:
            if 'auth_username' in self.originalEmailConfigs and 'clear_password' in self.originalEmailConfigs:
                encrypted_password = self.originalEmailConfigs['clear_password']
                splunkhome = os.environ.get('SPLUNK_HOME')
                if splunkhome == None:
                    self.logger.error('getCredentials - unable to retrieve credentials; SPLUNK_HOME not set')
                    return None
                #if splunk home has white spaces in path
                splunkhome='\"' + splunkhome + '\"'
                if sys.platform == "win32":
                    encr_passwd_env = "\"set \"ENCRYPTED_PASSWORD=" + encrypted_password + "\" "
                    commandparams = ["cmd", "/C", encr_passwd_env, "&&", os.path.join(splunkhome, "bin", "splunk"), "show-decrypted", "--value", "\"\"\""]
                else:
                    encr_passwd_env = "ENCRYPTED_PASSWORD='" + encrypted_password + "'"
                    commandparams = [encr_passwd_env, os.path.join(splunkhome, "bin", "splunk"), "show-decrypted", "--value", "''"]
                command = ' '.join(commandparams)
                stream = os.popen(command)
                clear_password = stream.read()
                #the decrypted password is appended with a '\n'
                if len(clear_password) >= 1:
                    clear_password = clear_password[:-1]
                return self.originalEmailConfigs['auth_username'], clear_password
        except Exception as e:
            self.logger.error("Could not get email credentials from splunk, using no credentials. Error: %s" % (str(e)))

        return '', ''
    

    def filter_recipients_if_not_in_allowed_domains(self, recipients):
        if self.emailConfigs['allowedDomainList'] != "" and self.emailConfigs['allowedDomainList'] != None:
            validRecipients = []

            domains = []
            domains.extend(EMAIL_DELIM.split(self.emailConfigs['allowedDomainList']))
            domains = [d.strip() for d in domains]
            domains = [d.lower() for d in domains]

            recipients = [r.lower() for r in recipients]

            for recipient in recipients:
                dom = recipient.partition("@")[2]
                if not dom in domains:
                    self.logger.error("Email recipient=%s is not among the allowedDomainList=%s in alert_actions.conf file. Removing it from the recipients list."
                                % (recipient, self.emailConfigs['allowedDomainList']))
                else:
                    validRecipients.append(recipient)

            if len(validRecipients) != len(recipients):
                self.logger.error("Not all of the recipient email domains are on the allowed domain list. Sending emails only to %s" % str(validRecipients))
            
            return validRecipients

        else:
            return recipients


    def send(self, to, cc=[], bcc=[], subject='Splunk Alert', html_body=''):

        subject = 'Splunk Alert: {}'.format(subject)

        # Define Email
        email = MIMEMultipart('mixed')
        email.preamble = 'This is a multi-part message in MIME format.'
        emailBody = MIMEMultipart('alternative')
        email.attach(emailBody)

        self.buildEmailHeaders(email, to, cc, bcc, subject)
        self.logger.info("email headers: {}".format(email.as_string()))

        # Attaching content to email body
        html_footer_content = CyencesEmailHTMLBodyBuilder.htmlFooterTemplate().render(footer='This email is generated by Cyences App for Splunk. (Build By: CrossRealms International)', re=re, filters=filters)
        full_html_body = CyencesEmailHTMLBodyBuilder.htmlRootTemplate().render(body=html_body, footer=html_footer_content)
        emailBody.attach(MIMEText(full_html_body, 'html', _charset=CHARSET))

        # Remove recipients if it's not from allowedDomainList
        validRecipients = self.filter_recipients_if_not_in_allowed_domains(self.recipients)

        if len(validRecipients) == 0:
            raise Exception("The email domains of the recipients are not among those on the allowed domain list.")

        mail_log_msg = 'Sending email. subject="%s", encoded_subject="%s", recipients="%s", server="%s"' % (
            subject,
            email['Subject'],
            str(validRecipients),
            str(self.emailConfigs['mailserver'])
        )
        self.logger.info(mail_log_msg)

        try:
            # setup the Open SSL Context
            sslHelper = ssl_context.SSLHelper()
            serverConfJSON = sslHelper.getServerSettings(self.session_key)
            # Pass in settings from alert_actions.conf into context
            ctx = sslHelper.createSSLContextFromSettings(
                sslConfJSON=self.originalEmailConfigs,
                serverConfJSON=serverConfJSON,
                isClientContext=True)

            # send the mail
            if not self.emailConfigs['use_ssl']:
                smtp = secure_smtplib.SecureSMTP(host=self.emailConfigs['mailserver'])
            else:
                # TODO - This is not tested yet
                smtp = secure_smtplib.SecureSMTP_SSL(host=self.emailConfigs['mailserver'], sslContext=ctx)


            if self.emailConfigs['use_tls']:
                smtp.starttls(ctx)

            if len(self.emailConfigs['username']) > 0 and self.emailConfigs['password'] is not None and len(self.emailConfigs['password']) >0:
                smtp.login(self.emailConfigs['username'], self.emailConfigs['password'])

            try:
                # mail_options SMTPUTF8 allows UTF8 message serialization
                smtp.sendmail(self.emailConfigs['from'], validRecipients, email.as_string(), mail_options=["SMTPUTF8"])
            except SMTPNotSupportedError:
                # sendmail is not configured to handle UTF8
                smtp.sendmail(self.emailConfigs['from'], validRecipients, email.as_string())

            smtp.quit()

        except Exception as e:
            self.logger.error(e)
            raise
