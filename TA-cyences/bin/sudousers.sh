#!/bin/sh
groups=$(cat /etc/sudoers | grep "ALL=(ALL" | awk '{print $1}'  | grep % | grep -v '#')
for i in $groups
do
group_name=$(echo $i | cut -d "%" -f 2)
users=$(getent group $group_name|  cut -d ":" -f 4)
IFS=',' read -ra user_array <<< "$users"
for i in "${user_array[@]}"
do
    echo sudouser=$i
done
done
users=$(cat /etc/sudoers | grep "ALL=(ALL" | awk '{print $1}' | grep -v % | grep -v '#')
for i in $users
do
echo sudouser=$i
done
