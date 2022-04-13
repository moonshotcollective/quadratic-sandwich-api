package routes

import (
	"quadratic-sandwich-api/controllers"

	"github.com/gofiber/fiber/v2"
)

func ApiHolderRoutes(api fiber.Router) {

	holderApi := api.Group("/holder")
	holderApi.Post("/ballots/cast", controllers.CastBallot)

}
