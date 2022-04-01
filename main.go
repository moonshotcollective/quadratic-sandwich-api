package main

import (
	"log"
	"os"
	"quadratic-sandwich-api/server"

	"github.com/gofiber/fiber/v2"
)

func main() {

	// Create a new Fiber service
	app := fiber.New()

	// Initialize the <projects> api endpoints
	server.RouteProjects(app)

	// Start the service and listen for requests
	err := app.Listen(":" + os.Getenv("PORT"))
	if err != nil {
		log.Fatal(err)
	}

}
