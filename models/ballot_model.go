package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Ballot struct {
	ID        string `json:"id,omitempty" bson:"_id,omitempty"`
	Version   string `json:"ballot_version"`
	Account   string `json:"ballot_account"`
	Votes     []Vote `json:"ballot_votes"`
	Signature string `json:"ballot_signature"`
}

type Vote struct {
	ID    primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"` // omitempty to protect against zeroed _id insertion
	Votes int                `json:"votes"`
}
