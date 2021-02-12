package main

import (
	"encoding/json"
	"fmt"
	"time"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type LicenseContract struct {
	contractapi.Contract
}

func (lc *LicenseContract) Initialize(ctx contractapi.TransactionContextInterface) error {
	fixedTime := time.Date(2021, time.January, 1, 23, 0, 0, 0, time.UTC)
	expirationTime := time.Date(2022, time.January, 1, 23, 0, 0, 0, time.UTC)

	lc.PutLicense(ctx, "L1", "username", fixedTime, "content_id", 1, expirationTime)
	lc.PutLicense(ctx, "L2", "username", fixedTime, "content_id", 1, expirationTime)
	lc.PutLicense(ctx, "L3", "username", fixedTime, "content_id", 1, expirationTime)
	lc.PutLicense(ctx, "L4", "username", fixedTime, "content_id", 1, expirationTime)
	lc.PutLicense(ctx, "L5", "username", fixedTime, "content_id", 1, expirationTime)
	lc.PutLicense(ctx, "L6", "username", fixedTime, "content_id", 1, expirationTime)
	lc.PutLicense(ctx, "L7", "username", fixedTime, "content_id", 1, expirationTime)
	lc.PutLicense(ctx, "L8", "username", fixedTime, "content_id", 1, expirationTime)
	lc.PutLicense(ctx, "L9", "username", fixedTime, "content_id", 1, expirationTime)
	lc.PutLicense(ctx, "L10", "username", fixedTime, "content_id", 1, expirationTime)

	return nil
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

func (lc *LicenseContract) GetAllLicenses(ctx contractapi.TransactionContextInterface) ([]*License, error) {
	queryString := "{\"selector\": {\"assetType\": \"license\"}}"
	resultsIterator, queryErr := ctx.GetStub().GetQueryResult(queryString)
	if (queryErr != nil) {
		return nil, queryErr
	}
	defer resultsIterator.Close()

	var resultList []*License

	for resultsIterator.HasNext() {
		resultResponse, nextErr := resultsIterator.Next()
		if nextErr != nil {
			return nil, nextErr
		}

		result := new(License)
		unmarshalError := json.Unmarshal(resultResponse.Value, result)
		if (unmarshalError != nil) {
			return nil, unmarshalError
		}

		resultList = append(resultList, result);
	}

	return resultList, nil
}

func (lc *LicenseContract) GetLicensesForOwner(ctx contractapi.TransactionContextInterface, owner string) ([]*License, error) {
	queryString := fmt.Sprintf("{\"selector\": {\"assetType\": \"license\", \"owner\": \"%s\"}}", owner);
	resultsIterator, queryErr := ctx.GetStub().GetQueryResult(queryString)
	if (queryErr != nil) {
		return nil, queryErr
	}
	defer resultsIterator.Close()

	var resultList []*License

	for resultsIterator.HasNext() {
		resultResponse, nextErr := resultsIterator.Next()
		if nextErr != nil {
			return nil, nextErr
		}

		result := new(License)
		unmarshalError := json.Unmarshal(resultResponse.Value, result)
		if (unmarshalError != nil) {
			return nil, unmarshalError
		}

		resultList = append(resultList, result);
	}

	return resultList, nil
}

func (lc *LicenseContract) GetLicenseForOwnedProduct(ctx contractapi.TransactionContextInterface, owner string, productid string) (*License, error) {
	queryString := fmt.Sprintf("{\"selector\": {\"assetType\": \"license\", \"owner\": \"%s\", \"contentid\": \"%s\"}}", owner, productid)

	resultsIterator, queryErr := ctx.GetStub().GetQueryResult(queryString)
	if (queryErr != nil) {
		return nil, queryErr
	}
	defer resultsIterator.Close()

	var resultList []*License

	for resultsIterator.HasNext() {
		resultResponse, nextErr := resultsIterator.Next()
		if nextErr != nil {
			return nil, nextErr
		}

		result := new(License)
		unmarshalError := json.Unmarshal(resultResponse.Value, result)
		if (unmarshalError != nil) {
			return nil, unmarshalError
		}

		resultList = append(resultList, result);
	}

	return resultList[0], nil
}

func (lc *LicenseContract) PutLicense(ctx contractapi.TransactionContextInterface, id string, owner string, creationTime time.Time, contentID string, versionNumber int, expiration time.Time) (*License, error) {
	existing, getError := ctx.GetStub().GetState(id)

	if getError != nil {
		return nil, fmt.Errorf("Unable to fetch data from world state")
	}

	if existing != nil {
		return nil, fmt.Errorf("License with id %s already exists", id)
	}

	result := new(License)
	result.UUID = id
	result.AssetType = "license"
	result.Owner = owner
	result.TimeStamp = creationTime
	result.ApplicableContentID = contentID
	result.ApplicableVersion = versionNumber
	result.Expiration = expiration

	resultBytes, unmarshalError := json.Marshal(result)
	if unmarshalError != nil {
		return nil, fmt.Errorf("Data retrieved from world state for id %s was not of type License", id)
	}

	ctx.GetStub().PutState(result.UUID, resultBytes)

	return result, nil
}