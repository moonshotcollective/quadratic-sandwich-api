package models

type Opco struct {
	Address 	string 	 `json:"address"`
	Supply 		int 	 `json:"supply"`
	Citizens 	[]string `json:"citizen_addresses"`
}
