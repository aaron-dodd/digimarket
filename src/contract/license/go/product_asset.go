package main

import (
	"time"
)

type Product struct {
	UUID string `json:"uuid"`
	Owner Owner `json:"owner"`
	TimeStamp time.Time`json:"timestamp"`
	FileName string `json:"filename"`
	FileHash string `json:"filehash"`
	Version int `json:"version"`
}
