package main

import (
	"time"
)

type Product struct {
	UUID string `json:"uuid"`
	AssetType string `json:"assetType"`
	Owner string `json:"owner"`
	TimeStamp time.Time`json:"timestamp"`
	FileName string `json:"filename"`
	FileHash string `json:"filehash"`
	Version int `json:"version"`
}
