package routes

import (
	"quadratic-sandwich-api/controllers"
	"quadratic-sandwich-api/middleware"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/basicauth"
)

func ApiHolderRoutes(api fiber.Router) {

	holderApi := api.Group("/holder")
	holderApi.Use(basicauth.New(basicauth.Config{
		Realm:      "Forbidden",
		Authorizer: middleware.HolderAuth,
		Unauthorized: func(c *fiber.Ctx) error {
			return c.SendStatus(401)
		},
		ContextUsername: "_account",
		ContextPassword: "_signature",
	}))
	holderApi.Post("/ballots/cast", controllers.CastBallot)

}
