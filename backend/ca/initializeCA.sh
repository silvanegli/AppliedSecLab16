#!/bin/bash
set -e

MYDIR="$(dirname "$(readlink -f "$0")")"
source $MYDIR/config.cfg

echo '\ncreate ca folders and files'
echo '------------------------------------'

mkdir -p /etc/ssl/ca/certs/users && 
mkdir -p /etc/ssl/ca/crl 
mkdir -p /etc/ssl/ca/private
touch /etc/ssl/ca/serial

echo '\ncreate database and crlnumber file'
echo '------------------------------------'

touch /etc/ssl/ca/index.txt && echo '01' > /etc/ssl/ca/crlnumber

echo '\ncreate ca private key'
echo '------------------------------------'

openssl genrsa -out /etc/ssl/ca/private/ca.key 4096


echo '\ncreate new self signed ca certificat'
echo '------------------------------------'

openssl req -new -x509 -days 1095 \
    -config /etc/ssl/openssl.cnf \
    -key /etc/ssl/ca/private/ca.key \
    -out /etc/ssl/ca/certs/ca.crt \

echo '\ncreate ca revocation list'
echo '------------------------------------'

openssl ca -name CA_default -gencrl \
    -config /etc/ssl/openssl.cnf \
    -keyfile /etc/ssl/ca/private/ca.key \
    -cert /etc/ssl/ca/certs/ca.crt \
    -out /etc/ssl/ca/private/ca.crl \
-crldays 1095
