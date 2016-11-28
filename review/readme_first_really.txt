Guys,

Just a couple of notes about the VMs to avoid confusion:
	1. There are two internal networks setup: ca_network (models the internal network of the company) and internet (models, well, internet). Client and firewall are connected to "internet", firewall and all *box machines are connected to ca_network.
	2. I used some virtualbox NAT interfaces to have access to the real internet from the VMs. These interfaces are not relevant for the system to run, so you can simply remove them.
	3. Make sure to start sqlbox before webbox. Otherwise you might have to run `sudo systemctl restart ca_web.service`.
	4. I really advice to take at least an initial snapshot of all VMs. Snapshot really saved me a couple of times while doing this task.
	6. I hope you'll have fun at searching for backdoors. We really wanted them to be interesting.
	7. JIC, my email is viktorc@ethz.ch. Mail me if something's not working.

Thanks!