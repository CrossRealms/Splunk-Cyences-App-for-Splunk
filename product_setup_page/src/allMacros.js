let allMacros = [
    {
        section: 'Data-model',
        macros: [
            'cs_summariesonly_endpoint',
            'cs_summariesonly_network_traffic',
            'cs_summariesonly_authentication',
            'cs_summariesonly_network_resolution_dns',
            'cs_summariesonly_cyences_vulnerabilities',
            'cs_summariesonly_cyences_assets',
        ]
    },
    {
        section: 'Network',
        macros: [
            'cs_network_traffic_map_filter',
            'cs_network_scanning_map_filter',
            'cs_home_country',
            'cs_network_home_location_lat',
            'cs_network_home_location_lon',
        ]
    },
    {
        section: 'Other Macros',
        macros: [
            'cs_lansweeper_timerange',
            'cs_wineventlog_security_timerange',
            'cs_wineventlog_system_timerange',
            'cs_sysmon_timerange',
            'cs_qualys_timerange',
            'cs_qualys_linux_os',
        ]
    },
    {
        section: 'Windows & AD',
        macros: [
            'cs_ad_bulk_user_creation_deletion_count_limit',
            'cs_ad_password_change_outside_working_hour_definition',
            'cs_ad_important_role',
            'cs_ad_important_policy',
            'cs_ad_important_user',
            'cs_ad_important_group',
        ]
    },
    {
        section: 'O365',
        macros: [
            'cs_o365_failed_login_outside_country_filter',
        ]
    },
    {
        section: 'Email', macros: [
            'cs_email_increase_over_baseline_limit',
        ]
    },
    {
        section: 'Palo Alto',
        macros: [
            'cs_palo_ddos_prevented_filter',
            'cs_palo_firewall_login_failure_filter',
            'cs_palo_blocked_ip_inbound_filter',
            'cs_palo_blocked_ip_outbound_filter',
            'cs_palo_malicious_ip_list_filter',
            'cs_palo_search_blocked_ip_lookup_name',
            'cs_palo_malicious_ip_list_filter_old_results',
        ]
    },
    {
        section: 'Sophos',
        macros: [
            'cs_sophos_update_errors_filter',
            'cs_sophos_endpoint_outofdate_filter',
            'cs_sophos_core_restore_failed_filter',
            'cs_sophos_expiration_messages_filter',
            'cs_sophos_exploit_prevented',
            'cs_sophos_malware_detected',
        ]
    },
    {
        section: 'Windows Defender',
        macros: [
            'cs_windows_defender_update_errors_filter',
            'cs_windows_defender_antivirus_expired_filter',
            'cs_windows_defender_antivirus_dropped_support_for_os_filter',
            'cs_windows_defender_antivirus_will_expired_filter',
            'cs_windows_defender_antivirus_will_dropped_support_for_os_filter',
            'cs_windows_defender_antivirus_scan_failed_filter',
            'cs_windows_defender_unable_to_download_offline_scan_filter',
            'cs_windows_defender_malware_detected_filter',
        ]
    },
    {
        section: 'CrowdStrike',
        macros: [
            'cs_crowdstrike_malware_detected_report_filter',
            'cs_crowdstrike_malware_prevented_filter',
        ]
    },
    {
        section: 'VPN',
        macros: [
            'cs_vpn_dashboard_filter',
        ]
    },
    {
        section: 'Authentication',
        macros: [
            'cs_authentication_app_filter',
            'cs_bruteforce_from_user_additional_filter',
            'cs_bruteforce_from_source_additional_filter',
            'cs_authentication_bruteforce_attempt_limit',
            'cs_authentication_excessive_vpn_login_failure_limit',
            'cs_authentication_new_location_login_pct_limit',
            'cs_authentication_vpn_session_duration_limit',
        ]
    },
];

export default allMacros;