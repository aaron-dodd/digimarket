package main

import (
	"encoding/json"
	"fmt"
	"time"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type ProductContract struct {
	contractapi.Contract
}

func (pc *ProductContract) Initialize(ctx contractapi.TransactionContextInterface) error {
	fixedTime := time.Date(2021, time.January, 1, 23, 0, 0, 0, time.UTC)

	pc.PutProduct(ctx, "P1", "username", fixedTime, "foobar.file.name", "foobar.file.hash", 1)
	pc.PutProduct(ctx, "P2", "username", fixedTime, "foobar.file.name", "foobar.file.hash", 1)
	pc.PutProduct(ctx, "P3", "username", fixedTime, "foobar.file.name", "foobar.file.hash", 1)
	pc.PutProduct(ctx, "P4", "username", fixedTime, "foobar.file.name", "foobar.file.hash", 1)
	pc.PutProduct(ctx, "P5", "username", fixedTime, "foobar.file.name", "foobar.file.hash", 1)
	pc.PutProduct(ctx, "P6", "username", fixedTime, "foobar.file.name", "foobar.file.hash", 1)
	pc.PutProduct(ctx, "P7", "username", fixedTime, "foobar.file.name", "foobar.file.hash", 1)
	pc.PutProduct(ctx, "P8", "username", fixedTime, "foobar.file.name", "foobar.file.hash", 1)
	pc.PutProduct(ctx, "P9", "username", fixedTime, "foobar.file.name", "foobar.file.hash", 1)
	pc.PutProduct(ctx, "P10", "username", fixedTime, "foobar.file.name", "foobar.file.hash", 1)

	return nil
}

func (pc *ProductContract) GetProduct(ctx contractapi.TransactionContextInterface, id string) (*Product, error) {
	existing, getError := ctx.GetStub().GetState(id)

	if getError != nil {
		return nil, fmt.Errorf("Unable to fetch data from world state")
	}

	if existing == nil {
		return nil, fmt.Errorf("Product with id %s does not exist", id)
	}

	result := new(Product)

	unmarshalError := json.Unmarshal(existing, result)
	if unmarshalError != nil {
		return nil, fmt.Errorf("Data retrieved from world state for key %s was not of type Product", id)
	}

	return result, nil
}

func (pc *ProductContract) GetAllProducts(ctx contractapi.TransactionContextInterface) ([]*Product, error) {
	queryString := "{\"selector\": {\"assetType\": \"product\"}}"
	resultsIterator, queryErr := ctx.GetStub().GetQueryResult(queryString)
	if (queryErr != nil) {
		return nil, queryErr
	}
	defer resultsIterator.Close()

	var resultList []*Product

	for resultsIterator.HasNext() {
		resultResponse, nextErr := resultsIterator.Next()
		if nextErr != nil {
			return nil, nextErr
		}

		result := new(Product)
		unmarshalError := json.Unmarshal(resultResponse.Value, result)
		if (unmarshalError != nil) {
			return nil, unmarshalError
		}

		resultList = append(resultList, result);
	}

	return resultList, nil
}

func (pc *ProductContract) GetProductsForOwner(ctx contractapi.TransactionContextInterface, owner string) ([]*Product, error) {
	queryString := fmt.Sprintf("{\"selector\": {\"assetType\": \"product\", \"owner\": \"%s\"}}", owner);
	resultsIterator, queryErr := ctx.GetStub().GetQueryResult(queryString)
	if (queryErr != nil) {
		return nil, queryErr
	}
	defer resultsIterator.Close()

	var resultList []*Product

	for resultsIterator.HasNext() {
		resultResponse, nextErr := resultsIterator.Next()
		if nextErr != nil {
			return nil, nextErr
		}

		result := new(Product)
		unmarshalError := json.Unmarshal(resultResponse.Value, result)
		if (unmarshalError != nil) {
			return nil, unmarshalError
		}

		resultList = append(resultList, result);
	}

	return resultList, nil
}

func (pc *ProductContract) PutProduct(ctx contractapi.TransactionContextInterface, id string, owner string, creationTime time.Time, filename string, filehash string, version int) (*Product, error) {
	existing, getError := ctx.GetStub().GetState(id)

	if getError != nil {
		return nil, fmt.Errorf("Unable to fetch data from world state")
	}

	if existing != nil {
		return nil, fmt.Errorf("Product with id %s already exists", id)
	}

	result := new(Product)
	result.UUID = id
	result.AssetType = "product"
	result.Owner = owner
	result.TimeStamp = creationTime
	result.FileName = filename
	result.FileHash = filehash
	result.Version = version

	resultBytes, unmarshalError := json.Marshal(result)
	if unmarshalError != nil {
		return nil, fmt.Errorf("Data retrieved from world state for id %s was not of type Product", id)
	}
	ctx.GetStub().PutState(result.UUID, resultBytes)

	return result, nil
}
