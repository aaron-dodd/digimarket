package main

import (
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type VerificationContract struct {
	contractapi.Contract
}

func (vc *VerificationContract) VerifyOwnership(ctx contractapi.TransactionContextInterface, licenseID string, fileID string) (*VerificationResult, error) {
	result := new(VerificationResult)
	result.Valid = false
	result.setVerificationResult(VERIFICATION_REASON_UNKNOWN)

	return result, nil
}
