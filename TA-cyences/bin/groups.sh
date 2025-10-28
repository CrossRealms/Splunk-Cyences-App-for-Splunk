#!/bin/sh
getent group | awk -F: '{cmd="date +%s"; cmd | getline timestamp; close(cmd); print "time=" timestamp " group_name=\"" $1 "\" users=\"" $4 "\""}'