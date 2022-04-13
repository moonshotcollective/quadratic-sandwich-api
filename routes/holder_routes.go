package routes

import (
	"quadratic-sandwich-api/controllers"

	"github.com/gofiber/fiber/v2"
)

func ApiHolderRoutes(api fiber.Router) {

	holderApi := api.Group("/holder")
	// holderApi.Use(basicauth.New(basicauth.Config{
	// 	Realm:      "Forbidden",
	// 	Authorizer: middleware.HolderAuth,
	// 	Unauthorized: func(c *fiber.Ctx) error {
	// 		return c.SendStatus(401)
	// 	},
	// 	ContextUsername: "_account",
	// 	ContextPassword: "_signature",
	// }))
	holderApi.Post("/ballots/cast", controllers.CastBallot)

}
