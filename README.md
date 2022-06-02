## Directory Structure

```
src
├── api
│   └── v1
│       ├── controllers     # Express route controllers for all the endpoints of the app
│       ├── helpers         # Application Helpers
│       ├── interfaces      # Application Interfaces and Types
│       ├── middlewares     # Express middlewares
│       ├── models          # Application data models
│       ├── repositories    # All the database interaction logic is here
│       ├── routes          # Application routes / endpoints
│       ├── services        # Application services
│       └── validators      # API Request object validations
├── server.ts               # Application entry point
└── tests                   # Server tests
```