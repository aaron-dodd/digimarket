package main

import (
	"encoding/json"
	"fmt"
	"time"
	"github.com/google/uuid"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type ProductContract struct {
	contractapi.Contract
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

func (pc *ProductContract) PutProduct(ctx contractapi.TransactionContextInterface, owner Owner, filename string, filehash string, version int) (*Product, error) {
	id := uuid.NewString()
	existing, getError := ctx.GetStub().GetState(id)

	if getError != nil {
		return nil, fmt.Errorf("Unable to fetch data from world state")
	}

	if existing != nil {
		return nil, fmt.Errorf("Product with id %s already exists", id)
	}

	result := new(Product)
	result.UUID = id
	result.Owner = owner
	result.TimeStamp = time.Now()
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
