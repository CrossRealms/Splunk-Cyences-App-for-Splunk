let allMacros = [
    {
        section: 'Device and User Inventory',
        macros: [
            {name: 'cs_device_inventory_hostname_postfixes' },
            {name: 'cs_user_inventory_user_prefixes' },
            {name: 'cs_user_inventory_user_postfixes' },
            {name: 'cs_user_inventory_data_filter', description: 'Used to filter the user inventory data.' },
        ]
    },
    {
        section: 'Network',
        macros: [
            {name: 'cs_network_traffic_map_filter' },
            {name: 'cs_network_scanning_map_filter' },
            {name: 'cs_home_country', description: 'Used to determine and filter the home location in the VPN dashboard and to identify O365 logins outside of home country. The country name should be compatible with the iplocation command (add quotes around the value in the macro definition)' },
            {name: 'cs_customer_own_public_ips', description: "Provide comma separated list of customer own public IPs. Ex. (20.x.x.x, 120.x.x.x, 101.x.x.x) " },
            {name: 'cs_network_home_location_lat', description: "Private IP's (10.x.x.x, 192.168.x.x, 172.16.x.x) will be displayed at this latitude on the map" },
            {name: 'cs_network_home_location_lon', description: "Private IP's (10.x.x.x, 192.168.x.x, 172.16.x.x) will be displayed at this longitude on the map" },
            {name: 'cs_basic_network_scanning_threshold', description: "Configure the threshold value for each host to visit different destination IPs and ports in an hour." },
        ]
    },
    {
        section: 'Imperva WAF',
        macros: [
            {name: 'cs_imperva_waf_attack_from_source_threshold'}
        ]
    },
    {
        section: 'Imperva DAM',
        macros: [
            {name: 'cs_imperva_dam_multiple_failed_login_threshold'}
        ]
    },
    {
        section: 'Lansweeper Dashboard',
        macros: [
            { name: 'cs_lansweeper_timerange', description: 'The Lansweeper dashboard searches Lansweeper data in the specified timerange' },
            { name: 'cs_wineventlog_security_timerange', description: 'The Lansweeper dashboard searches the WinEventLog:Security data in the specified timerange to see if the asset collects WinEventLog:Security data' },
            { name: 'cs_wineventlog_system_timerange', description: 'The Lansweeper dashboard searches the WinEventLog:System data in the specified timerange to see if the asset collects WinEventLog:System data' },
            { name: 'cs_sysmon_timerange', description: 'The Lansweeper dashboard searches the WinEventLog:Microsoft-Windows-Sysmon/Operational data in the specified timerange to see if the asset collects WinEventLog:Microsoft-Windows-Sysmon/Operational data' },
            { name: 'cs_qualys_timerange', description: 'The Cyences App searches Qualys data in the specified timerange for vulnerability information regarding the assets' },
            { name: 'cs_qualys_linux_os', description: 'Qualys data contains different Linux versions in the logs to identify them as Linux OS, so this condition is being used in the Lansweeper dashboard' },
        ]
    },
    {
        section: 'Windows & AD',
        macros: [
            { name: 'cs_ad_bulk_user_creation_deletion_count_limit' },
            { name: 'cs_ad_important_role', description: 'List of important roles. (e.g. "val1","val2")' },
            { name: 'cs_ad_important_policy', description: 'List of important policies. (e.g. "val1","val2")' },
            { name: 'cs_ad_important_user', description: 'List of important users. (e.g. "val1","val2")' },
            { name: 'cs_ad_important_group', description: 'List of important groups. (e.g. "val1","val2")' },
            { name: 'cs_windows_failed_logins_by_user_threshold' },
        ]
    },
    {
        section: 'O365',
        macros: [
            { name: 'cs_o365_failed_login_outside_country_filter' },
        ]
    },
    {
        section: 'Email', macros: [
            { name: 'cs_email_increase_over_baseline_limit' },
            { name: 'cs_email_user_domain', description: 'List of user domains. e.g. ("val1","val2")' },
        ]
    },
    {
        section: 'Palo Alto',
        macros: [
            { name: 'cs_palo_firewall_login_failure_filter' },
            { name: 'cs_palo_malicious_ip_list_filter' },
            { name: 'cs_palo_malicious_ip_list_filter_old_results', description: 'Only update the value between the quotes (the default value is -7d@h, which means the list of Globally Detected Malicious IPs keeps any IP address for seven days since the last appearance of any IP address)' },
        ]
    },
    {
        section: 'Sophos Endpoint Protection',
        macros: [
            { name: 'cs_sophos_update_errors_filter' },
            { name: 'cs_sophos_endpoint_outofdate_filter' },
            { name: 'cs_sophos_core_restore_failed_filter' },
            { name: 'cs_sophos_expiration_messages_filter' },
            { name: 'cs_sophos_exploit_prevented' },
            { name: 'cs_sophos_malware_detected' },
        ]
    },
    {
        section: 'Windows Defender',
        macros: [
            { name: 'cs_windows_defender_update_errors_filter' },
            { name: 'cs_windows_defender_antivirus_expired_filter' },
            { name: 'cs_windows_defender_antivirus_dropped_support_for_os_filter' },
            { name: 'cs_windows_defender_antivirus_will_expired_filter' },
            { name: 'cs_windows_defender_antivirus_will_dropped_support_for_os_filter' },
            { name: 'cs_windows_defender_antivirus_scan_failed_filter' },
            { name: 'cs_windows_defender_unable_to_download_offline_scan_filter' },
            { name: 'cs_windows_defender_malware_detected_filter' },
        ]
    },
    {
        section: 'CrowdStrike',
        macros: [
            { name: 'cs_crowdstrike_malware_detected_report_filter' },
            { name: 'cs_crowdstrike_malware_prevented_filter' },
        ]
    },
    {
        section: 'VPN',
        macros: [
            { name: 'cs_vpn_dashboard_filter' },
        ]
    },
    {
        section: 'Radius Authentication',
        macros: [
            { name: 'cs_radius_authentication_excessive_login_failure_limit' },
        ]
    },
    {
        section: 'Authentication',
        macros: [
            { name: 'cs_authentication_app_filter' },
            { name: 'cs_bruteforce_from_user_additional_filter' },
            { name: 'cs_bruteforce_from_source_additional_filter' },
            { name: 'cs_authentication_bruteforce_attempt_limit' },
            { name: 'cs_authentication_excessive_vpn_login_failure_limit' },
            { name: 'cs_authentication_new_location_login_pct_limit' },
            { name: 'cs_authentication_vpn_session_duration_limit' },
        ]
    }
];

export default allMacros;