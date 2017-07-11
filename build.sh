nvm use --lts 
cd  composer-sample-applications-hlfv1/packages/getting-started
npm install

cd ../../../

cd employee-network

node server.js &

cd tests
sh testTransaction.sh

cd ..
fuser -k 8000/tcp
fuser -k 8000/tcp

