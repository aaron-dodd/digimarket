package main

type VerificationResult struct {
	Valid bool
	Reason string
}

const (
	VERIFICATION_REASON_UNKNOWN = iota
	VERIFICATION_REASON_ERROR_LICENSE_NOT_FOUND
	VERIFICATION_REASON_VALID_SUCCESS
	VERIFICATION_REASON_INVALID
)

func (vr *VerificationResult) setVerificationResult(x int) {
	switch (x) {
	case VERIFICATION_REASON_ERROR_LICENSE_NOT_FOUND:
		vr.Reason = "License was not found on ledger. This license does not exist"
		break;
	case VERIFICATION_REASON_INVALID:
		vr.Reason = "License is invalid for supplied file. You do not have permission to use this file"
		break;
	case VERIFICATION_REASON_VALID_SUCCESS:
		vr.Reason = "License is valid for supplied file! All checks passed"
		break;
	default:
		vr.Reason = "Could not determine appropriate verification reason"
		break;
	}

	return
}
