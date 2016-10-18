#!/bin/bash
source config.cfg

# arguments:
# user id
# cert name
# parameters (http://www.shellhacks.com/en/HowTo-Create-CSR-using-OpenSSL-Without-Prompt-Non-Interactive): /C=[country code]/ST=[state]/L=[town]/O=[organization]/OU=[org. unit]/CN=[common name]

userDir="$configUserDir/$1"
key="$userDir/$2.key"
crt="$userDir/$2.crt"
csr="$userDir/$2.csr"
if [ ! -d "$userDir" ]; then
	mkdir "$userDir"
fi

openssl genrsa -out "$key" $configUserKeyLength

openssl req -new -key "$key" -out "$csr" -subj "$3"

openssl x509 -passin "pass:1234" -req -days $configUserDaysValid -in "$csr" -CA "$configCAcert" -CAkey "$configCAkey" -CAserial "$configCAserial" -CAcreateserial -out "$crt"

rm "$csr"
