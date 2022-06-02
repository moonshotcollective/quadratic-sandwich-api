use crate::{models::citizen_model::Citizen, repository::mongodb_repo::MongoRepo};
use mongodb::results::InsertOneResult;
use rocket::{http::Status, serde::json::Json, State};

#[post("/citizen", data = "<new_citizen>")]
pub fn create_citizen(
    db: &State<MongoRepo>,
    new_citizen: Json<Citizen>,
) -> Result<Json<InsertOneResult>, Status> {
    let data = Citizen {
        id: None,
        address: new_citizen.address.to_owned(),
    };
    let citizen_detail = db.create_citizen(data);
    match citizen_detail {
        Ok(citizen) => Ok(Json(citizen)),
        Err(_) => Err(Status::InternalServerError),
    }
}

#[get("/citizen/<path>")]
pub fn get_citizen(db: &State<MongoRepo>, path: String) -> Result<Json<Citizen>, Status> {
    let id = path;
    if id.is_empty() {
        return Err(Status::BadRequest);
    };
    let user_detail = db.get_citizen(&id);
    match user_detail {
        Ok(user) => Ok(Json(user)),
        Err(_) => Err(Status::InternalServerError),
    }
}