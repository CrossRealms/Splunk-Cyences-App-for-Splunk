#!/bin/bash
test=$(cat /etc/sudoers | grep "#includedir /etc/sudoers.d")
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
for i in "${user_array[@]}"
do
    echo sudouser=$i
done
done
if  [ -z "$test" ]; 
then
users=$(cat /etc/sudoers | grep "ALL\s*=\s*(ALL" | awk '{print $1}' | grep -v % | grep -v '#')
else
users=$(cat /etc/sudoers /etc/sudoers.d/* | grep "ALL\s*=\s*(ALL" | awk '{print $1}' | grep -v % | grep -v '#')
fi
for i in $users
do
echo sudouser=$i
done