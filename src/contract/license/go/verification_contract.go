package main

import (
	"fmt"
	"encoding/json"
	"time"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type VerificationContract struct {
	contractapi.Contract
}

func (vc *VerificationContract) VerifyOwnership(ctx contractapi.TransactionContextInterface, licenseID string, fileID string) (*VerificationResult, error) {
	result := new(VerificationResult)
	result.Valid = true

	existingLicense, getError := ctx.GetStub().GetState(licenseID)

	if getError != nil {
		return nil, fmt.Errorf("Unable to fetch data from world state")
	}

	if existingLicense == nil {
		result.Valid = false
		result.setVerificationResult(VERIFICATION_REASON_ERROR_LICENSE_NOT_FOUND)
		return result, nil
	}

	license := new(License)

	unmarshalError := json.Unmarshal(existingLicense, license)
	if unmarshalError != nil {
		return nil, fmt.Errorf("Data retrieved from world state for key %s was not of type License", licenseID)
	}

	if time.Now().Before(license.Expiration) {
		result.Valid = true
		result.setVerificationResult(VERIFICATION_REASON_VALID_SUCCESS)
	} else {
		result.Valid = false
		result.setVerificationResult(VERIFICATION_REASON_UNKNOWN)
	}


	return result, nil
}
