package models

type Project struct {
	ID          string   `json:"id,omitempty" bson:"_id,omitempty"`
	Version     string   `json:"api_version"`
	Title       string   `json:"project_title"`
	Description string   `json:"project_description"`
	Timestamp   string   `json:"timestamp"`
	Meta        Metadata `json:"project_meta"`    // DEPRECATE
	Ballots     []Ballot `json:"project_ballots"` // DEPRECATE
	Votes       int      `json:"votes"`
}

type Metadata struct {
	Notes string `json:"notes"`
}
