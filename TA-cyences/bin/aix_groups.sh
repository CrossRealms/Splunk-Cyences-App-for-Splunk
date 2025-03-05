lsgroup ALL | awk '{
    cmd="date +%s"; 
    cmd | getline timestamp; 
    close(cmd);

    split($0, fields, " ");  # Split the line by spaces
    group_name=fields[1];     # First field is the group name
    users=""; admins="";

    # Loop through fields to extract users and admins
    for (i=2; i<=NF; i++) {
        if ($i ~ /^users=/) users=substr($i, 7);   # Extract users
        if ($i ~ /^adms=/) admins=substr($i, 6);   # Extract admins
    }

    print "time=" timestamp " group_name=\"" group_name "\" users=\"" users "\" admins=\"" admins "\"";
}'
