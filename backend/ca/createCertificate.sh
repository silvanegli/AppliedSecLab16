#!/bin/bash

#make sure script exits 1 if any commmand fails
set -e

MYDIR="$(dirname "$(readlink -f "$0")")"
source $MYDIR/config.cfg



# arguments:
# user id
# cert name
# subject emailAddress
# parameters (http://www.shellhacks.com/en/HowTo-Create-CSR-using-OpenSSL-Without-Prompt-Non-Interactive): /C=[country code]/ST=[state]/L=[town]/O=[organization]/OU=[org. unit]/CN=[common name]

userDir="$configUserDir/$1"

key="$userDir/$2.key"
crt="$userDir/$2.crt"
csr="$userDir/$2.csr"
p12="$userDir/$2.p12"

subject="/CN=$1 /emailAddress=$3"

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
openssl x509 -req -days $configUserDaysValid -in "$csr" -CA "$configCAcert" -CAkey "$configCAkey" -CAserial "$configCAserial" -out "$crt"

echo "*******************************************************************************"
echo "created certificate:"
echo "*******************************************************************************"
openssl x509 -in $crt -text

rm "$csr"

echo "*******************************************************************************"
echo "creating pkcs12 archive under: ${p12}"
echo "*******************************************************************************"

openssl pkcs12 -export -clcerts -in "$crt" -inkey "$key" -out "$p12" -passout "pass:"


echo "*******************************************************************************"
echo "certificate and pkcs12 creation successfull"
echo "*******************************************************************************"

exit 0
