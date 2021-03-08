# DigiMarket development guide
## Prerequisites

You will need to install the following before working on the application

 - Docker
 - Golang
 - Minifabric executable added to $REPO/bin/ directory
 - MongoDB running on localhost:27017 (default port)
 - Local IPFS instance running on localhost:5001 (default ports)
 - latest versions of Node.js and NPM

## Building

The following commands are to be executed from a terminal session in a
directory of your choosing.

 - clone the repository into your working directory using `git clone`.
 - change directory into the repository using `cd ./repository`.
 - set the `GOPATH` environment variable to the root of the cloned repository.
 - Add the Minifabric release executable from [https://github.com/hyperledger-labs/minifabric/](https://github.com/hyperledger-labs/minifabric/)
   into `/bin` as per the documentation.

If this succeeded without errors, you have successfully installed the
application. In order to setup a default network you can run the following
command from the root directory.

```
./src/tool/script/network-start.ps1
```

which will run the hyperledger network locally using Docker Containers and install the license chaincode

Once the network is running, you can run the back-end and front-end web components.

## Back-End

 - change directory to `./src/interface/server`.
 - run `npm run server`. Running this command will cause the terminal session to block so further steps
   will need by taken using a different terminal session.

If everything is configured properly this should run without fail and launch on port 4000.

## Front-end

 - change directory to `./src/interface/client`.
 - run `npm run start`. Running this command will cause the terminal session to block so further steps
   will need by taken using a different terminal session.

# Troubleshooting
## Error connecting to hyperledger network when creating initial accounts

If when creating accounts via the web interface and logging in, the account cannot connect to the hyperledger network,
this may be due to an intermittent bug when registering the admin user. For now this can be remedied by deleting the
current wallet files in `./src/interface/server/wallet` and attempting to create a new account. This issue also only
seems to occur after the network has first been created.