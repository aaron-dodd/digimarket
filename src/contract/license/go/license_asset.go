package main

import (
	"time"
)

type License struct {
	UUID string `json:"uuid"`
	Owner Owner `json:"owner"`
	TimeStamp time.Time `json:"timestamp"`
	ApplicableContentID string `json:"contentid"`
	ApplicableVersion int `json:"version"`
	UsageTime time.Time `json:"usagetime"`
	UsagePeriod UsageDuration `json:"usageperiod"`
	Expiration time.Time `json:"expiration"`
}
