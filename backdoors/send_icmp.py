#! /usr/bin/env python
import socket, subprocess, sys
from scapy.all import *
import os.path

if len(sys.argv) != 5:
  print "Usage : " + " IP_SERVER " + " EXTERNAL_PORT " + " INTERNAL_PORT " + " DEST_IP "
  sys.exit(1)
server = sys.argv[1]
 
load = sys.argv[2]+"|"+sys.argv[3]+"|"+sys.argv[4]
pingr = IP(dst=server)/ICMP()/load
send(pingr,verbose=1)
