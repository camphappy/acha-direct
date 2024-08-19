#!/bin/bash

#itemUploadCleanup.sh
#Find and delete files older than the specified time limit

# Define the directory and time limit
DIRECTORY="/home/howardt/MernStart/acha-direct/backend/uploads"
TIME_LIMIT="5 minutes"

# Find and delete files older than the specified time limit
find "$DIRECTORY" -type f -mmin +5 -exec rm {} \;
