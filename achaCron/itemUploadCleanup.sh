#!/bin/bash

#itemUploadCleanup.sh
#Find and delete files older than the specified time limit

# Define the directory and time limit
uploadDirectory="/home/howardt/MernStart/acha-direct/backend/uploadstmp"

upload2Directory="/home/howardt/MernStart/acha-direct/backend/uploadsCSV"
TIME_LIMIT="15 minutes"

# delete files older than 15 mins
find "$uploadDirectory" -type f -mmin +14 -exec chmod 666 {} \;
find "$uploadDirectory" -type f -mmin +15 -exec rm {} \;
find "$upload2Directory" -type f -mtime +6 -exec chmod 666 {} \;
find "$upload2Directory" -type f -mtime +7 -exec rm {} \;
