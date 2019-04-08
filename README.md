# Certificate Authority Project
> This course emphasizes applied aspects of Information Security. The students will study a number of topics in a hands

on fashion and carry out experiments in order to better understand the need for secure implementation and configuration of IT systems and to assess the effectivity and impact of security measures. [...]  
The students will also complete an independent project: based on a set of functional requirements, they will design and implement a prototypical IT system. In addition, they will conduct a thorough security analysis and devise appropriate security measures for their systems. Finally, they will carry out a technical and conceptual review of another system. 

The following project description (short version) is taken from the [assignment.pdf](assignment.pdf) file.
Our **system description** together with the **risk analysis** can be found in the [report.pdf](https://github.com/silvanegli/AppliedSecLab16/blob/master/report/report.pdf). In order to setup **our system** 
you can download and import the following [appliance.ova](https://drive.google.com/open?id=14S32s4kC6AibPTYFD3vTlT0YS19Anpza) file into VirtualBox. In the [review.pdf](https://github.com/silvanegli/AppliedSecLab16/blob/master/review/review.pdf) you can find our analysis of the other group's system which can be downloaded [here](https://drive.google.com/open?id=13Vx4DCPUvofZo4if_ln6FsKDUijt4IkS).

## Background
The (fictional) company iMovies produces independent movies of various kind
but with a focus on investigative reporting. Therefore, information exchanged
within the company and with informants must be handled confidentially.

To do so, iMovies wants to take its first steps towards PKI-based services.
For this reason, a simple certificate authority (CA) should be implemented, with
which employees can be provided with digital certificates. These certificates will
be used for secure e-mail communication.

## Assignment
In groups of three students, you are expected to design and implement a CA
according to the requirements given below. In a second step, the implementations
will be exchanged among the groups and each group should then review
another group’s CA.

### Functional Requirements
1. **Certificate Issuing Process**  
The company already maintains a MySQL database in which all employees are
listed, along with their personal data as well as a user ID and a password. This
database is a legacy system, which cannot be migrated. The CA should verify
authorized certificate requests on the basis of this database.

2. **Certificate Revocation Process**  
Employees need the possibility to revoke certificates, for example, when their
private key is compromised or lost.

3. **CA Administrator Interface**  
Using a dedicated web interface, CA administrators (not necessarily system
administrators!) can consult the CA’s current state.

4. **Key Backup**  
A copy of all keys and certificates issued must be stored in an archive. The
archive is intended to ensure that encrypted data is still accessible even in the
case of loss of an employee’s certificate or private key, or even the employee
himself.

5. **System Administration and Maintenance**  
The system should provide appropriate and secure interfaces for remote administration.
In addition, an automated back-up solution must be implemented,
which includes configuration and logging information.

6. **Components to Be Provided**
- **Web Server**: User interfaces, certificate requests, certificate delivery, revocation
requests, etc;
- **Core CA**: Management of user certificates, CA configuration, CA certificates
and keys, functionality to issue new certificates, etc;
- **MySQL Database**: Legacy database with user data. 
- **Backup**: Backup of keys and certificates from the Core CA and of configuration
and logging information.
- **Client**: Sample client system that allows one to test the CA’s functionality from
outside the company’s network. The client system should be configured
such that all functions can be tested. This includes the configuration of a
special certificate to test the administrator interfaces.

### Security Requirements
The most important security requirements are:
- Access control with regard to the CA functionality and data, in particular
configuration and keys;
- Secrecy and integrity with respect to the private keys in the key backup.
Note that the protection of the private keys on users’ computers is the
responsibility of the individual users;
- Secrecy and integrity with respect to user data;
- Access control on all components.

You are supposed to derive the necessary security measures from a risk
analysis.

### Backdoors
You must build two backdoors into your system. Both backdoors should allow
remote access to the system(s) and compromise its purpose. The reviewers of
your system will later have to search for these backdoors.
Design and implement a first backdoor so that it will be nontrivial but likely
for the reviewers to find it. Give your best effort when it comes to the second
backdoor! Try to hide it so well that the reviewers will not find it.
