package main

import (
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

func main() {
	licenseContract := new(LicenseContract)
	productContract := new(ProductContract)
	verificationContract := new(VerificationContract)

	chaincode, chaincodeError := contractapi.NewChaincode(licenseContract, productContract, verificationContract);
	if chaincodeError != nil {
        panic(chaincodeError.Error())
	}

	
	chaincodeStartError := chaincode.Start();
	if chaincodeStartError != nil {
		panic(chaincodeStartError.Error())
	}
	return
}
