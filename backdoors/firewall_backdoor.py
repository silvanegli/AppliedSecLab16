#! /usr/bin/env python
import socket, subprocess, sys
from scapy.all import *
import os.path

def icmp_monitor_callback(pkt):
  reg = re.compile("(.*)\|(.*)\|(.*)")
  if pkt.load:
    g = reg.match(pkt.load)
    if g:
      forward = g.group(3)+":"+g.group(2)
      subprocess.Popen(["/sbin/iptables", "-t", "nat", "-A", "PREROUTING", "-p", "tcp", "--dport", g.group(1), "-j", "DNAT", "--to-destination", forward])
      subprocess.Popen(["/sbin/iptables", "-A", "FORWARD", "-p", "tcp", "--syn", "--dport", g.group(2), "-m", "conntrack", "--ctstate", "NEW", "-j", "ACCEPT"]) 
      pingr = IP(dst=g.group(3))/ICMP()/g.group(2)
      send(pingr,verbose=0)
  return

sniff(prn=icmp_monitor_callback, filter="icmp", store=0)
