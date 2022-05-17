package controllers

import (
	"fmt"
	"log"
	"quadratic-sandwich-api/models"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetProjects(ctx *fiber.Ctx) error {
	query := bson.D{{}}
	cursor, err := mg.DB.Collection(projectCollection).Find(ctx.Context(), query)
	if err != nil {
		log.Fatal(err.Error())
		return ctx.Status(500).SendString(err.Error())
	}
	var projects []models.Project = make([]models.Project, 0)
	// iterate the cursor and decode each item into a party
	if err := cursor.All(ctx.Context(), &projects); err != nil {
		return ctx.Status(500).SendString(err.Error())
	}
	return ctx.JSON(projects)
}

func GetProject(ctx *fiber.Ctx) error {
	id, err := primitive.ObjectIDFromHex(
		ctx.Params("id"),
	)
	if err != nil {
		return ctx.SendStatus(400)
	}
	project := new(models.Project)
	query := bson.D{{Key: "_id", Value: id}}
	err = mg.DB.Collection(projectCollection).FindOne(ctx.Context(), query).Decode(&project)
	if err != nil {
		// ErrNoDocuments means that the filter did not match any documents in the collection
		if err == mongo.ErrNoDocuments {
			return ctx.SendStatus(404)
		}
		return ctx.SendStatus(500)
	}
	return ctx.Status(200).JSON(project)
}

func NewProjects(ctx *fiber.Ctx) error {
	// JWT authorization OP
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
		if claims["role"] != "OP_ROLE" || claims["isOP"] == false {
			return ctx.SendStatus(401)
		}
	} else {
		fmt.Println(err)
	}

	collection := mg.DB.Collection(projectCollection)
	projects := new([]models.Project) // Expects JSON blob of array Project-like objects
	if err := ctx.BodyParser(&projects); err != nil {
		return ctx.Status(400).SendString(err.Error())
	}
	for _, project := range *projects {
		project.ID = ""
		project.Version = apiVersion
		insertRes, err := collection.InsertOne(ctx.Context(), project)
		if err != nil {
			return ctx.Status(500).SendString(err.Error())
		}
		filter := bson.D{{Key: "_id", Value: insertRes.InsertedID}}
		createdRecord := collection.FindOne(ctx.Context(), filter)
		createdProject := &models.Project{}
		createdRecord.Decode(createdProject)
	}
	return ctx.Status(200).SendString("Success")
}

// Docs: https://docs.mongodb.com/manual/reference/command/delete/
func DeleteProject(ctx *fiber.Ctx) error {
	// JWT authorization OP
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
		if claims["role"] != "OP_ROLE" || claims["isOP"] == false {
			return ctx.SendStatus(401)
		}
	} else {
		fmt.Println(err)
	}
	id, err := primitive.ObjectIDFromHex(
		ctx.Params("id"),
	)
	if err != nil {
		return ctx.SendStatus(400)
	}

	// find and delete the party with the given ID
	query := bson.D{{Key: "_id", Value: id}}
	result, err := mg.DB.Collection(projectCollection).DeleteOne(ctx.Context(), &query)
	if err != nil {
		return ctx.SendStatus(500)
	}
	if result.DeletedCount < 1 {
		return ctx.SendStatus(404)
	}
	// the record was deleted
	return ctx.SendStatus(204)
}
