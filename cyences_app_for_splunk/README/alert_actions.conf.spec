[cyences_send_digest_email_action]
param.to = <str> Comma separated email addresses
param.cyences_severity =  <str> Comma separated severities. ie. critical,high,medium,low,info
param.exclude_alert = <str> Comma separated alert names to exclude from digest email

[cyences_send_email_action]
param.default_to =  <str> Comma separated email addresses
param.cyences_severity =  <str> Comma separated severities. ie. critical,high,medium,low,info
param.include_to =  <str> Comma separated email addresses to be added in addition to default_to
param.exclude_to =  <str> Comma separated email addresses to exclude from default_to
param.disable_email = <0|1> 1 to disable email and 0 to enable email