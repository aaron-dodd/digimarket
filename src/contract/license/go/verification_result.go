package main

type VerificationResult struct {
	Valid bool
	Reason string
}

const (
	VERIFICATION_REASON_UNKNOWN = iota
	VERIFICATION_REASON_VALID_SUCCESS
	VERIFICATION_REASON_INVALID
)

func (vr *VerificationResult) setVerificationResult(x int) {
	switch (x) {
	case VERIFICATION_REASON_VALID_SUCCESS:
		vr.Reason = "License is valid for supplied file! All checks passed"
		break;
	case VERIFICATION_REASON_INVALID:
		vr.Reason = "License is invalid for supplied file. You do not have permission to use this file"
		break;
	default:
		vr.Reason = "Could not determine appropriate verification reason"
		break;
	}

	return
}
