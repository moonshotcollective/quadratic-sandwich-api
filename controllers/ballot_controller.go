package controllers

import (
	"fmt"
	"log"
	"quadratic-sandwich-api/models"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
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
	// JWT validation for holder authorization
	auth := strings.ReplaceAll(ctx.GetReqHeaders()["Authorization"], "Bearer ", "")
	token, err := jwt.Parse(auth, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(signatrue_secret), nil
	})
	if err != nil {
		log.Fatal(err)
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if claims["role"] != "holder" {
			return ctx.SendStatus(401)
		}
	} else {
		fmt.Println(err)
	}

	// Ballot upload
	// TODO: Verify ballot signature
	ballotCollection := mg.DB.Collection(ballotCollection)
	ballot := new(models.Ballot) // Expects JSON blob of array ballot-like objects
	if err := ctx.BodyParser(&ballot); err != nil {
		return ctx.Status(400).SendString(err.Error())
	}
	ballot.ID = ""
	ballot.Version = apiVersion
	insertRes, err := ballotCollection.InsertOne(ctx.Context(), ballot)
	if err != nil {
		return ctx.Status(500).SendString(err.Error())
	}
	filter := bson.D{{Key: "_id", Value: insertRes.InsertedID}}
	createdRecord := ballotCollection.FindOne(ctx.Context(), filter)
	createdProject := &models.Project{}
	createdRecord.Decode(createdProject)

	// Lookup respctive projects and increment their vote count by cast votes
	// TODO: Check for negative Votes
	for _, vote := range ballot.Votes {
		projectId := vote.ID
		query := bson.D{{Key: "_id", Value: projectId}}
		update := bson.D{
			{Key: "$inc",
				Value: bson.D{
					{Key: "Votes", Value: vote.Votes},
				},
			},
		}
		err = mg.DB.Collection(projectCollection).FindOneAndUpdate(ctx.Context(), query, update).Err()
		if err != nil {
			if err == mongo.ErrNoDocuments {
				return ctx.SendStatus(404)
			}
			return ctx.SendStatus(500)
		}
	}

	return ctx.Status(200).SendString("Success")
}
