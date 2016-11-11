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

openssl ca -config "$configOpensslConf" -revoke "$crt"  
echo "*******************************************************************************"
echo "revoked certificate: ${crt}"
echo "*******************************************************************************"

openssl ca -config "$configOpensslConf" -gencrl -out "$configIntermCrl"
echo "*******************************************************************************"
echo "rebuilt certificate revocation list: $configIntermCrl"
echo "*******************************************************************************"

openssl crl -in "$configIntermCrl" -noout -text

echo "*******************************************************************************"
echo "rebuilding chained revocation list: $configChainCrl"
echo "*******************************************************************************"
cat $configIntermCrl $configRootCrl > $configChainCrl

echo "*******************************************************************************"
echo "reloading nginx in order to make changes visible"
echo "*******************************************************************************"
sudo /usr/sbin/service nginx reload


