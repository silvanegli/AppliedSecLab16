#!/bin/bash

MYDIR="$(dirname "$(readlink -f "$0")")"
echo $MYDIR

source $MYDIR/config.cfg

# arguments:
# user id
# cert name
# parameters (http://www.shellhacks.com/en/HowTo-Create-CSR-using-OpenSSL-Without-Prompt-Non-Interactive): /C=[country code]/ST=[state]/L=[town]/O=[organization]/OU=[org. unit]/CN=[common name]

userDir="$configUserDir/$1"

key="$userDir/$2.key"
crt="$userDir/$2.crt"
csr="$userDir/$2.csr"
subject="/CN=$1"

if [ ! -d "$userDir" ]; then
	echo "*******************************************************************************"
	echo "creating user directory: ${userDir}"
	echo "*******************************************************************************"

	mkdir "$userDir"
fi

echo "*******************************************************************************"
echo "creating private key: ${key} with length: ${configUserKeyLength}"
echo "*******************************************************************************"

openssl genrsa -out "$key" $configUserKeyLength

echo "*******************************************************************************"
echo "creating user certificate request: ${csr} for subject: ${subject}"
echo "*******************************************************************************"

openssl req -new -key "$key" -out "$csr" -subj "$subject"


echo "*******************************************************************************"
echo "creating signed user certificate: ${crt}"
echo "*******************************************************************************"

openssl x509 -req -days $configUserDaysValid -in "$csr" -CA "$configCAcert" -CAkey "$configCAkey" -CAserial "$configCAserial" -CAcreateserial -out "$crt"

echo "*******************************************************************************"
echo "created certificate:"
echo "*******************************************************************************"
openssl x509 -in $crt -text

rm "$csr"
