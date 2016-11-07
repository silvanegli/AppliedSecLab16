#!/bin/bash

#make sure script exits 1 if any commmand fails
set -e

MYDIR="$(dirname "$(readlink -f "$0")")"
source $MYDIR/config.cfg

# arguments:
# user id
# cert name

userDir="$configUserDir/$1"
crt="$userDir/$2.crt"

openssl ca -name $configCAname -revoke "$crt" -keyfile "$configCAkey" -cert "$configCAcert" 
echo "*******************************************************************************"
echo "revoked certificate: ${crt}"
echo "*******************************************************************************"

openssl ca -name $configCAname -gencrl -keyfile "$configCAkey" -cert "$configCAcert" -out "$configCAcrl" -crldays $configCAcrlDaysValid 
echo "*******************************************************************************"
echo "rebuilt certificate revocation list: $configCAcrl"
echo "*******************************************************************************"

openssl crl -in "$configCAcrl" -noout -text

echo "*******************************************************************************"
echo "reloading nginx in order to make changes visible"
echo "*******************************************************************************"
service nginx reload




