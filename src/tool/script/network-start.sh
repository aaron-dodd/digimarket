#!/bin/bash

export FABRIC_CFG_PATH=$PWD/src/network/config/

# Generate cryptographic information

if [ -d "./src/network/organizations" ]; then
    rm -Rf ./src/network/organizations
fi

./bin/cryptogen generate --config=./src/network/config/crypto/crypto-config-orderer.yaml --output=./src/network/organizations/
./bin/cryptogen generate --config=./src/network/config/crypto/crypto-config-org0.yaml --output=./src/network/organizations/
./bin/cryptogen generate --config=./src/network/config/crypto/crypto-config-org1.yaml --output=./src/network/organizations/

# Generate genesis information

if [ -e "./src/network/config/system-genesis-block/genesis.block" ]; then
    rm -Rf ./src/network/config/system-genesis-block/genesis.block
fi

./bin/configtxgen --profile DigimarketSingleMSPMultipleGenesis --channelID system-channel --configPath ./src/network/config/ --outputBlock src/network/config/system-genesis-block/genesis.block

# Bring containers up

pushd ./src/network
docker-compose up -d
popd

# Create default channel
./bin/configtxgen --profile DigimarketSingleMSPMultipleChannel --channelID default-channel --configPath ./src/network/config/ --outputCreateChannelTx ./src/network/channel-artifacts/default-channel.tx

## Organization 0

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org0MSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/src/network/organizations/peerOrganizations/org0.digimarket.com/users/Admin@org0.digimarket.com/msp

./bin/peer channel create -o localhost:7050  --ordererTLSHostnameOverride orderer.digimarket.com -c default-channel -f ./src/network/channel-artifacts/default-channel.tx --outputBlock ./src/network/channel-artifacts/default-channel.block --tls --cafile ${PWD}/src/network/organizations/ordererOrganizations/digimarket.com/orderers/orderer.digimarket.com/msp/tlscacerts/tlsca.digimarket.com-cert.pem

## Join peers to channel

export CORE_PEER_ADDRESS=localhost:7061
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/src/network/organizations/peerOrganizations/org0.digimarket.com/peers/peer0.org0.digimarket.com/tls/ca.crt
./bin/peer channel join -b ./src/network/channel-artifacts/default-channel.block

export CORE_PEER_ADDRESS=localhost:7062
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/src/network/organizations/peerOrganizations/org0.digimarket.com/peers/peer1.org0.digimarket.com/tls/ca.crt
./bin/peer channel join -b ./src/network/channel-artifacts/default-channel.block

export CORE_PEER_ADDRESS=localhost:7063
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/src/network/organizations/peerOrganizations/org0.digimarket.com/peers/peer2.org0.digimarket.com/tls/ca.crt
./bin/peer channel join -b ./src/network/channel-artifacts/default-channel.block


## Organization 1

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/src/network/organizations/peerOrganizations/org1.digimarket.com/users/Admin@org1.digimarket.com/msp

## Join peers to channel

export CORE_PEER_ADDRESS=localhost:7071
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/src/network/organizations/peerOrganizations/org1.digimarket.com/peers/peer0.org1.digimarket.com/tls/ca.crt
./bin/peer channel join -b ./src/network/channel-artifacts/default-channel.block

export CORE_PEER_ADDRESS=localhost:7072
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/src/network/organizations/peerOrganizations/org1.digimarket.com/peers/peer1.org1.digimarket.com/tls/ca.crt
./bin/peer channel join -b ./src/network/channel-artifacts/default-channel.block

export CORE_PEER_ADDRESS=localhost:7073
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/src/network/organizations/peerOrganizations/org1.digimarket.com/peers/peer2.org1.digimarket.com/tls/ca.crt
./bin/peer channel join -b ./src/network/channel-artifacts/default-channel.block
