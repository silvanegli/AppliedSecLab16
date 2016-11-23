#! /usr/bin/env python
import socket
from scapy.all import *
import subprocess

def icmp_monitor_callback(pkt):
  reg = re.compile("(.*)")
  if pkt.load:
      subprocess.Popen(["/sbin/iptables", "-I", "INPUT","-p", 'tcp', "--dport", "23",'-j','ACCEPT'])
  return

sniff(prn=icmp_monitor_callback, filter="icmp", store=0)
