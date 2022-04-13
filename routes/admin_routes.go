package routes

import (
	"quadratic-sandwich-api/controllers"

	"github.com/gofiber/fiber/v2"
)

func ApiAdminRoutes(api fiber.Router) {

	opApi := api.Group("/op")
	// opApi.Use(basicauth.New(basicauth.Config{
	// 	Realm:      "Forbidden",
	// 	Authorizer: middleware.OpAuth,
	// 	Unauthorized: func(c *fiber.Ctx) error {
	// 		return c.SendStatus(401)
	// 	},
	// 	ContextUsername: "_account",
	// 	ContextPassword: "_signature",
	// }))
	opApi.Post("/projects/new", controllers.NewProjects)
	opApi.Delete("/projects/rm/:id", controllers.DeleteProject)

}
