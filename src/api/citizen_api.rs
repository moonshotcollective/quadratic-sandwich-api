use crate::{models::user_model::User, repository::mongodb_repo::MongoRepo};
use mongodb::results::InsertOneResult;
use rocket::{http::Status, serde::json::Json, State};

#[post("/citizen", data = "<new_citizen>")]
pub fn create_user(
    db: &State<MongoRepo>,
    new_user: Json<User>,
) -> Result<Json<InsertOneResult>, Status> {
    let data = User {
        id: None,
        address: new_citizen.address.to_owned(),
    };
    let citizen_detail = db.create_citizen(data);
    match citizen_detail {
        Ok(citizen) => Ok(Json(citizen)),
        Err(_) => Err(Status::InternalServerError),
    }
}