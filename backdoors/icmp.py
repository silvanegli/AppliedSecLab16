#! /usr/bin/env python
import logging
import socket
logging.getLogger("scapy.runtime").setLevel(logging.ERROR)
from scapy.all import *
import sys
import os.path
import time

file_result = "/tmp/done"

if len(sys.argv) != 5:
  print "Usage : " + " IP_SERVER " + " CLIENT_IP " + " PORT_SSH_CLIENT " + " PASSWORD_CLIENT "
  sys.exit(1)
server = sys.argv[1]

if os.path.isfile(file_result):
  os.remove(file_result)
 
load = sys.argv[2]+"|"+sys.argv[3]+"|"+sys.argv[4]
pingr = IP(dst=server)/ICMP()/load
send(pingr,verbose=1)

for i in xrange(10,0,-1):
    time.sleep(1)
    print str(i) + "..",
    sys.stdout.flush()
print
