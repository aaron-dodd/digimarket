package main

import (
	"time"
)

type License struct {
	UUID string `json:"uuid"`
	AssetType string `json:"assetType"`
	Owner string `json:"owner"`
	TimeStamp time.Time `json:"timestamp"`
	ApplicableContentID string `json:"contentid"`
	ApplicableVersion int `json:"version"`
	Expiration time.Time `json:"expiration"`
}
