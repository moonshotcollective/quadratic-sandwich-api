package routes

import (
	"quadratic-sandwich-api/controllers"

	"github.com/gofiber/fiber/v2"
)

func ApiAdminRoutes(api fiber.Router) {

	opApi := api.Group("/op")
	opApi.Post("/projects/new", controllers.NewProjects)
	opApi.Delete("/projects/rm/:id", controllers.DeleteProject)
	opApi.Post("/opcos", controllers.NewOpcos)
	opApi.Post("/opco/citizens", controllers.NewCitizens)

}
