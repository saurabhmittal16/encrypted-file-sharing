#! /bin/bash
# Script to clear temporary files generated for user

cd /home/saurabh/Data/Projects/encrypted-file-sharing/tmp
while true
do
    find ./* -type f --mmin +1 -exec rm {} \;
done
