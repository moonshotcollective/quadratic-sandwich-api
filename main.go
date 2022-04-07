package main

import (
	"log"
	"os"
	"quadratic-sandwich-api/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
)

func main() {

	// Create a new Fiber service
	app := fiber.New()
	// TODO: Configure CORS
	app.Use(cors.New())
	// Rate Limit
	app.Use(limiter.New())

	api := app.Group("/api")
	// Initialize the <projects> api endpoints
	routes.ApiRoutes(api)

	routes.ApiAdminRoutes(api)
	routes.ApiHolderRoutes(api)

	// Start the service and listen for requests
	err := app.Listen(":" + os.Getenv("PORT"))
	if err != nil {
		log.Fatal(err)
	}

}
