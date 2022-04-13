package controllers

import (
	"fmt"
	"log"
	"quadratic-sandwich-api/models"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
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

	auth := strings.ReplaceAll(ctx.GetReqHeaders()["Authorization"], "Bearer ", "")
	fmt.Println(auth)
	token, err := jwt.Parse(auth, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
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
