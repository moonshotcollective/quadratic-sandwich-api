package controllers

import (
	"log"
	"quadratic-sandwich-api/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
)

func GetBallots(ctx *fiber.Ctx) error {
	query := bson.D{{}}
	cursor, err := mg.DB.Collection(ballotCollection).Find(ctx.Context(), query)
	if err != nil {
		log.Fatal(err.Error())
		return ctx.Status(500).SendString(err.Error())
	}
	var ballots []models.Ballot = make([]models.Ballot, 0)
	// iterate the cursor and decode each item into a party
	if err := cursor.All(ctx.Context(), &ballots); err != nil {
		return ctx.Status(500).SendString(err.Error())
	}
	return ctx.JSON(ballots)
}

func CastBallot(ctx *fiber.Ctx) error {
	collection := mg.DB.Collection(ballotCollection)
	ballot := new(models.Ballot) // Expects JSON blob of array ballot-like objects
	if err := ctx.BodyParser(&ballot); err != nil {
		return ctx.Status(400).SendString(err.Error())
	}
	ballot.ID = ""
	ballot.Version = apiVersion
	insertRes, err := collection.InsertOne(ctx.Context(), ballot)
	if err != nil {
		return ctx.Status(500).SendString(err.Error())
	}
	filter := bson.D{{Key: "_id", Value: insertRes.InsertedID}}
	createdRecord := collection.FindOne(ctx.Context(), filter)
	createdProject := &models.Project{}
	createdRecord.Decode(createdProject)
	// }
	return ctx.Status(200).SendString("Success")
}
