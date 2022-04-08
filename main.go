package main

import (
	"context"
	"log"
	"os"
	"quadratic-sandwich-api/routes"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoInstance struct {
	Client *mongo.Client
	DB     *mongo.Database
}

var mongoURI string
var projectCollection string
var ballotCollection string
var dbName string
var apiVersion string

var mg MongoInstance

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Print("Error loading .env file")
	}
	// Get env variables
	mongoURI = os.Getenv("DATABASE_URL")
	projectCollection = os.Getenv("PROJECT_COLLECTION")
	ballotCollection = os.Getenv("BALLOT_COLLECTION")
	dbName = os.Getenv("DATABASE_NAME")
	apiVersion = os.Getenv("API_VERSION")

	client, err := mongo.NewClient(options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}
	ctx, stop := context.WithTimeout(context.Background(), 30*time.Second)
	defer stop()
	err = client.Connect(ctx)
	db := client.Database(dbName)
	if err != nil {
		log.Fatal(err)
	}
	mg = MongoInstance{
		Client: client,
		DB:     db,
	}
}

func main() {
	// Create a new Fiber service
	app := fiber.New()

	// TODO: Configure CORS
	app.Use(cors.New())
	// Rate Limit
	app.Use(limiter.New())
	app.Use(logger.New())

	// Initialize api endpoint
	api := app.Group("/api")
	// Set public api routes
	routes.ApiRoutes(api)
	// Set admin (OP) api routes
	routes.ApiAdminRoutes(api)
	// Set holder api routes
	routes.ApiHolderRoutes(api)

	// Start the service and listen for requests
	err := app.Listen(":" + os.Getenv("PORT"))
	if err != nil {
		log.Fatal(err)
	}

}
