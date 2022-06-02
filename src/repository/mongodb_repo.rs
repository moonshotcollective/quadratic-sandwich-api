use std::env; 
extern crate dotenv;
use dotenv::dotenv;

use mongodb::{
    bson::{extjson::de::Error, oid::ObjectId, doc}, 
    results::{ InsertOneResult }, 
    sync::{Client, Collection},
};

use crate::models::citizen_model::Citizen;

pub struct MongoRepo {
    col: Collection<Citizen>,
}

impl MongoRepo {
    pub fn init() -> Self {
        dotenv().ok(); 
        let uri = match env::var("MONGO_URI") {
            Ok(v) => v.to_string(), 
            Err(_) => format!("Error Loading MongoDB URI enviroment variable"),
        }; 
        let client = Client::with_uri_str(uri).unwrap(); 
        let db = client.database("rustDB"); 
        let col: Collection<Citizen> = db.collection("Citizen"); 
        MongoRepo { col }
    }

    pub fn create_citizen(&self, new_citizen: Citizen) -> Result<InsertOneResult, Error> {
        let new_doc = Citizen {
            id: None, 
            address: new_citizen.address
        }; 
        let citizen = self.col.insert_one(new_doc, None).ok().expect("Error: creating citizen");
        Ok(citizen)
    }

    pub fn get_citizen(&self, id: &String) -> Result<Citizen, Error> {
        let obj_id = ObjectId::parse_str(id).unwrap();
        let filter = doc! {"_id": obj_id};
        let user_detail = self
            .col
            .find_one(filter, None)
            .ok()
            .expect("Error getting user's detail");
        Ok(user_detail.unwrap())
    }
}