package main

import (
	"log"
	"os"
	"quadratic-sandwich-api/middleware"
	"quadratic-sandwich-api/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	jwtware "github.com/gofiber/jwt/v3"
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
	// Connect user
	app.Post("/login", middleware.Login)
	// JWT
	app.Use(jwtware.New(jwtware.Config{
		SigningKey: []byte(os.Getenv("SIGNATURE_SECRET")),
	}))

	// Initialize api endpoints group
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
