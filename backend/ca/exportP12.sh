#!/bin/bash
source config.cfg

# arguments:
# user id
# cert name

userDir="$configUserDir/$1"
key="$userDir/$2.key"
crt="$userDir/$2.crt"
#p12="$userDir/$2.p12"
if [ ! -d "$userDir" ]; then
	mkdir "$userDir"
fi

openssl pkcs12 -export -clcerts -in "$crt" -inkey "$key" -passout "pass:"
