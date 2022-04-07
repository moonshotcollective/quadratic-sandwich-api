package routes

import (
	"quadratic-sandwich-api/controllers"

	"github.com/gofiber/fiber/v2"
)

func ApiRoutes(api fiber.Router) {

	public := api.Group("/")
	public.Get("/projects", controllers.GetProjects)
	public.Get("/projects/:id", controllers.GetProject)
	public.Get("/ballots", controllers.GetBallots)

}
