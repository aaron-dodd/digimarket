#!/bin/bash

pushd ./src/network
../../bin/minifab.cmd up -e true -d false -c default-channel -o org0.digimarket.com
popd
