//add the modules
mod api; 
mod models;
mod repository;

#[macro_use]
extern crate rocket;
use rocket::{get, http::Status, serde::json::Json};

//add imports below
use api::citizen_api::{create_citizen, get_citizen};
use repository::mongodb_repo::MongoRepo;


#[launch]
fn rocket() -> _ {
    let db = MongoRepo::init();
    rocket::build()
        .manage(db)
        .mount("/", routes![create_citizen])
        .mount("/", routes![get_citizen])
}