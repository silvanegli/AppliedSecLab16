#!/bin/bash
source config.cfg

# arguments:
# user id
# cert name

userDir="$configUserDir/$1"
crt="$userDir/$2.crt"

openssl ca -name $configCAname -revoke "$crt" -keyfile "$configCAkey" -cert "$configCAcert" 

openssl ca -name $configCAname -gencrl -keyfile "$configCAkey" -cert "$configCAcert" -out "$configCAcrl" -crldays $configCAcrlDaysValid 

cat "$configCAcrl"
