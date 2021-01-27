#!/bin/bash

export FABRIC_CFG_PATH=$PWD/src/network/config/
export FABRIC_CHAINCODE_NAME=$1
export FABRIC_CHAINCODE_LABEL=$2

## Package Chaincode
./bin/peer lifecycle chaincode package ./src/contract/packages/$FABRIC_CHAINCODE_NAME-cn.tar.gz --path ./src/contract/chaincode/$FABRIC_CHAINCODE_NAME --label $FABRIC_CHAINCODE_LABEL

## Install on organization 0 peers
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org0MSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/src/network/organizations/peerOrganizations/org0.digimarket.com/users/Admin@org0.digimarket.com/msp

export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/src/network/organizations/peerOrganizations/org0.digimarket.com/peers/peer0.org0.digimarket.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7061
./bin/peer lifecycle chaincode install ./src/contract/packages/$FABRIC_CHAINCODE_NAME-cn.tar.gz --tls --orderer localhost:7050 --ordererTLSHostnameOverride orderer.digimarket.com --cafile ${PWD}/src/network/organizations/ordererOrganizations/digimarket.com/orderers/orderer.digimarket.com/msp/tlscacerts/tlsca.digimarket.com-cert.pem

export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/src/network/organizations/peerOrganizations/org0.digimarket.com/peers/peer1.org0.digimarket.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7062
./bin/peer lifecycle chaincode install ./src/contract/packages/$FABRIC_CHAINCODE_NAME-cn.tar.gz --tls --orderer localhost:7050 --ordererTLSHostnameOverride orderer.digimarket.com --cafile ${PWD}/src/network/organizations/ordererOrganizations/digimarket.com/orderers/orderer.digimarket.com/msp/tlscacerts/tlsca.digimarket.com-cert.pem

export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/src/network/organizations/peerOrganizations/org0.digimarket.com/peers/peer2.org0.digimarket.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7063
./bin/peer lifecycle chaincode install ./src/contract/packages/$FABRIC_CHAINCODE_NAME-cn.tar.gz --tls --orderer localhost:7050 --ordererTLSHostnameOverride orderer.digimarket.com --cafile ${PWD}/src/network/organizations/ordererOrganizations/digimarket.com/orderers/orderer.digimarket.com/msp/tlscacerts/tlsca.digimarket.com-cert.pem


## Install on organization 1 peers
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/src/network/organizations/peerOrganizations/org1.digimarket.com/users/Admin@org1.digimarket.com/msp

export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/src/network/organizations/peerOrganizations/org1.digimarket.com/peers/peer0.org1.digimarket.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7071
./bin/peer lifecycle chaincode install ./src/contract/packages/$FABRIC_CHAINCODE_NAME-cn.tar.gz --tls --orderer localhost:7050 --ordererTLSHostnameOverride orderer.digimarket.com --cafile ${PWD}/src/network/organizations/ordererOrganizations/digimarket.com/orderers/orderer.digimarket.com/msp/tlscacerts/tlsca.digimarket.com-cert.pem

export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/src/network/organizations/peerOrganizations/org1.digimarket.com/peers/peer1.org1.digimarket.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7072
./bin/peer lifecycle chaincode install ./src/contract/packages/$FABRIC_CHAINCODE_NAME-cn.tar.gz --tls --orderer localhost:7050 --ordererTLSHostnameOverride orderer.digimarket.com --cafile ${PWD}/src/network/organizations/ordererOrganizations/digimarket.com/orderers/orderer.digimarket.com/msp/tlscacerts/tlsca.digimarket.com-cert.pem

export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/src/network/organizations/peerOrganizations/org1.digimarket.com/peers/peer2.org1.digimarket.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7073
./bin/peer lifecycle chaincode install ./src/contract/packages/$FABRIC_CHAINCODE_NAME-cn.tar.gz --tls --orderer localhost:7050 --ordererTLSHostnameOverride orderer.digimarket.com --cafile ${PWD}/src/network/organizations/ordererOrganizations/digimarket.com/orderers/orderer.digimarket.com/msp/tlscacerts/tlsca.digimarket.com-cert.pem
