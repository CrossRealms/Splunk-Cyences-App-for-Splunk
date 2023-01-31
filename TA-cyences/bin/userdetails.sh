#!/bin/bash
test1=$(cat /etc/sudoers)
status=$?
test=$(echo $test1| grep "#includedir /etc/sudoers.d")
date=$(date +%s)
if [ $status -eq 0 ]; then
    if  [ -z "$test" ];
    then
    groups=$(cat /etc/sudoers | grep "ALL\s*=\s*(ALL" | awk '{print $1}'  | grep % | grep -v '#')
    else
    groups=$(cat /etc/sudoers /etc/sudoers.d/* | grep "ALL\s*=\s*(ALL" | awk '{print $1}'  | grep % | grep -v '#')
    fi
    for i in $groups
    do
    group_name=$(echo $i | cut -d "%" -f 2)
    users=$(getent group $group_name|  cut -d ":" -f 4)
    IFS=',' read -ra user_array <<< "$users"
    arrVar=(${arrVar[@]} ${user_array[@]})
    done
    if  [ -z "$test" ];
    then
    users=$(cat /etc/sudoers | grep "ALL\s*=\s*(ALL" | awk '{print $1}' | grep -v % | grep -v '#')
    else
    users=$(cat /etc/sudoers /etc/sudoers.d/* | grep "ALL\s*=\s*(ALL" | awk '{print $1}' | grep -v % | grep -v '#')
    fi
    arrVar=(${arrVar[@]} ${users[@]})
else
    sudoaccess="Yes"
fi
users=$(cut -d: -f1 /etc/passwd)
for user1 in $users
do
    user=$(cat /etc/passwd | grep "$user1:")
    USERNAME1=$(echo $user |  cut -d ":" -f 1);
    UID1=$(echo $user |  cut -d ":" -f 3);
    GID1=$(echo $user |  cut -d ":" -f 4);
    HOME_DIR1=$(echo $user |  cut -d ":" -f 6);
    USER_INFO1=$(echo $user |  cut -d ":" -f 5);
    COMMAND_SHELL1=$(echo $user |  cut -d ":" -f 7);
    if [ "$sudoaccess" != "Yes" ]; then
        for sudo in ${arrVar[@]};
        do
                if [ "$sudo" = "$USERNAME1" ]; then
                SUDOACCESS="Yes"
                fi
        done
        if [ "$SUDOACCESS" != "Yes" ]; then
                SUDOACCESS="No"
        fi
    else
        SUDOACCESS="Unable to access /etc/sudoers file. Run Splunk as root user."
    fi
    echo -e "time=$date USERNAME=\"$USERNAME1\" UID=\"$UID1\" GID=\"$GID1\" USER_INFO=\"$USER_INFO1\" HOME_DIR=\"$HOME_DIR1\" COMMAND_SHELL=\"$COMMAND_SHELL1\" SUDOACCESS=\"$SUDOACCESS\" \n";
done
