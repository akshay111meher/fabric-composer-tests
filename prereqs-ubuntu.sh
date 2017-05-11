#!/bin/bash

# Usage:
#
# ./prereqs-ubuntu.sh
#
# User must then logout and login upon completion of script
#

# Exit on any failure
set -e

# Array of supported versions
declare -a versions=('trusty' 'xenial' 'yakkety');

# check the version and extract codename of ubuntu if release codename not provided by user
if [ -z "$1" ]; then
    source /etc/lsb-release || \
        (echo "Release information not found, run script passing Ubuntu version codename as a parameter"; exit 1)
    CODENAME=$DISTRIB_CODENAME
else 
    CODENAME=$1
fi

# check version is supported
if echo ${versions[@]} | grep -q -w $CODENAME; then 
    echo "Installing Fabric Composer prereqs for Ubuntu $CODENAME"
else 
    echo "Ubuntu $CODENAME is not supported"
    exit 1
fi

# Update package lists
sudo apt-get update

# Install Git
sudo apt-get -y install git

# Install nvm dependencies
sudo apt-get -y install build-essential libssl-dev

# Execute nvm installation script
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash

# Set up nvm environment without restarting the shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Install node and npm
nvm install --lts

# Configure nvm to use version 6.9.5
nvm use --lts
nvm alias default 'lts/*'

# Install the latest version of npm
npm install npm@latest -g

# Ensure that CA certificates are installed
sudo apt-get -y install apt-transport-https ca-certificates

# Add Docker repository key to APT keychain
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Update where APT will search for Docker Packages
echo "deb [arch=amd64] https://download.docker.com/linux/ubuntu ${CODENAME} stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list

# Update package lists
sudo apt-get update

# Verifies APT is pulling from the correct Repository
sudo apt-cache policy docker-ce

# Install kernel packages which allows us to use aufs storage driver if V14 (trusty/utopic)
if [ "$CODENAME" == "trusty" ]; then
    sudo apt-get -y install linux-image-extra-$(uname -r) linux-image-extra-virtual
fi

# Install Docker
sudo apt-get -y install docker-ce

# Add user account to the docker group
sudo usermod -aG docker $(whoami)

# Install docker compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.13.0/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Print installation details for user
echo ''
echo 'Installation completed, versions installed are:'
echo ''
echo -n 'Node:           '
node --version
echo -n 'npm:            '
npm --version
echo -n 'Docker:         '
docker --version
echo -n 'Docker Compose: '
docker-compose --version

# Print reminder of need to logout in order for these changes to take effect!
echo ''
echo "Please logout then login before continuing."
