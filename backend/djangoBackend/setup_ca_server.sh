echo 'install system software'
sudo apt install python3-pip

sudo apt-get install python-pip python-dev build-essential
sudo pip install virtualenv virtualenvwrapper
sudo pip install --upgrade pip
sudo apt-get install python3-dev
sudo apt-get install libmysqlclient-dev

echo 'installing mysql'
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
sudo mysql_install_db
#CREATE DATABASE imovies;
#GRANT ALL PRIVILEGES ON dbTest.* To 'user'@'hostname' IDENTIFIED BY 'password';

echo 'installing uwsgi'
sudo pip install uwsgi

#create a backup of your .bashrc file
cp ~/.bashrc ~/.bashrc-org

# Be careful with this command
printf '\n%s\n%s\n%s' '# virtualenv' 'export WORKON_HOME=~/virtualenvs' \
'source /usr/local/bin/virtualenvwrapper.sh' >> ~/.bashrc

source ~/.bashrc
mkdir -p $WORKON_HOME
mkvirtualenv --python=python3 seclab

sudo apt-get install git

mkdir caServer && cd caServer
git init
git remote add -f origin https://github.com/worxli/seclab.git
git config core.sparseCheckout true
echo "backend/" >> .git/info/sparse-checkout
git pull origin master

cd backend/djangoBackend

pip install -r requirements.txt

