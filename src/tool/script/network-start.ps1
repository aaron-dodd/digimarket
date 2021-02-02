pushd ./src/network
robocopy ../contract/ ./vars/chaincode /S
../../bin/minifab.cmd up -e true -d false -c default-channel -o org0.digimarket.com -s couchdb -n license

# Initialize contracts
..\..\bin\minifab.cmd invoke -p '\"ProductContract:Initialize\"'
..\..\bin\minifab.cmd invoke -p '\"LicenseContract:Initialize\"'
popd
