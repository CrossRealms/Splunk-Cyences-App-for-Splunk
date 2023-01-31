#/bin/sh
groups=$(getent group)
for i in $groups;
do
    group_name=$(echo $i |  cut -d ":" -f 1);
    users=$(groups $group_name |  cut -d ":" -f 2 | tr ' ' ',' | cut -c 2-);
    date=$(date +%s)
    echo "time=$date group_name=$group_name users=\"$users\"";
done