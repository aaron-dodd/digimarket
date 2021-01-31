package main

import (
	"encoding/json"
	"fmt"
	"time"
	"github.com/google/uuid"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type LicenseContract struct {
	contractapi.Contract
}

func (lc *LicenseContract) GetLicense(ctx contractapi.TransactionContextInterface, id string) (*License, error) {
	existing, getError := ctx.GetStub().GetState(id)

	if getError != nil {
		return nil, fmt.Errorf("Unable to fetch data from world state")
	}

	if existing == nil {
		return nil, fmt.Errorf("License with id %s does not exist", id)
	}

	result := new(License)

	unmarshalError := json.Unmarshal(existing, result)
	if unmarshalError != nil {
		return nil, fmt.Errorf("Data retrieved from world state for key %s was not of type License", id)
	}

	return result, nil
}

func (lc *LicenseContract) PutLicense(ctx contractapi.TransactionContextInterface, owner Owner, contentID string, versionNumber int, usage time.Time, duration UsageDuration, expiration time.Time) (*License, error) {
	id := uuid.NewString()
	existing, getError := ctx.GetStub().GetState(id)

	if getError != nil {
		return nil, fmt.Errorf("Unable to fetch data from world state")
	}

	if existing != nil {
		return nil, fmt.Errorf("License with id %s already exists", id)
	}

	result := new(License)
	result.UUID = id
	result.Owner = owner
	result.TimeStamp = time.Now()
	result.ApplicableContentID = contentID
	result.ApplicableVersion = versionNumber
	result.UsageTime = usage
	result.UsagePeriod = duration
	result.Expiration = expiration

	resultBytes, unmarshalError := json.Marshal(result)
	if unmarshalError != nil {
		return nil, fmt.Errorf("Data retrieved from world state for id %s was not of type License", id)
	}

	ctx.GetStub().PutState(result.UUID, resultBytes)

	return result, nil
}