# DigiMarket development guide
## Prerequisites

You will need to install the following before working on the application

 - Docker
 - Golang
 - Node.js and NPM

### A note for Windows users

Hyperledger fabric doesn't have the highest level of support for the Windows
operating system. Therefore, if you are working with this repository on Windows
10, it is recommended to install WSL2 and run Docker for Windows via the WSL
container. All further commands in this installation guide can be executed using
a WSL linux virtual machine.

## Building

The following commands are to be executed from a terminal session in a
directory of your choosing, hereafter referred to as `PWD` for the present
working directory

 - clone the repository into your working directory using `git clone`
 - change directory into the repository using `cd ./repository`
 - set the `GOPATH` environment variable to the root of the cloned repository
 - Add the Fabric release from [https://github.com/hyperledger/fabric/releases/]
   into `/bin`

If this succeeded without errors, you have successfully installed the
application. In order to setup a default network you can run the following
command.

```
orchestrate network start
```

# Troubleshooting
## `error while creating mount source path: file exists`

Run `docker volume prune --force` and restart docker-desktop.