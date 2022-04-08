package main

import (
	"log"
	"os"
	"quadratic-sandwich-api/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// Create a new Fiber service
	app := fiber.New()

	// TODO: Configure CORS
	app.Use(cors.New())
	// Rate Limit
	app.Use(limiter.New())
	// Logger
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
