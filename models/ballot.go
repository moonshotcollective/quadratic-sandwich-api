package models

type Ballot struct {
	ID        string `json:"id,omitempty" bson:"_id,omitempty"`
	Version   string `json:"ballot_version"`
	Account   string `json:"ballot_account"`
	Votes     string `json:"ballot_votes"`
	Signature string `json:"ballot_signature"`
}
