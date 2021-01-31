package main

import (
	"time"
)

type UsageDuration struct {
	LowerBound time.Time `json:"lowerbound"`
	UpperBound time.Time `json:"upperbound"`
}
