# Alpaca's Backend

## Getting started

This is a basic REST API built with Node.js and Express following a variation of the Clean Architecture principles. It's created to provide a simple and scalable backend project to learn from.

It has a simple CRUD for a `User` entity.

## Instalattion

1. Clone the repository
2. Run `npm install`
3. Run `npm start`

## Running the tests

Run `npm test`

## API Documentation

The API documentation is available at `http://localhost:SERVER_PORT/docs`.

## Technologies to Highlight

- **Node.js**: Runtime environment for JavaScript.
- **Express**: Web application framework for Node.js.
- **Jest**: Testing framework.
- **Awilix**: Dependency injection framework.
- **MySQL2**: Library to connect to MySQL.
- **Swagger**: To document the API.

## Patterns

- **Dependency Inversion Principle**: High-level modules should not depend on low-level modules. Both should depend on abstractions.
- **Adapter Pattern**: Allows the interface of a class to be compatible with another interface.
- **Repository Pattern**: Provides an interface for data access and storage, abstracting the underlying implementation.
- **Builder Pattern**: Allows for the step-by-step construction of complex objects using a builder class.
- **Singleton Pattern**: Ensures that a class has only one instance and provides a global point of access to it.

## Main Layers
- **Domain**: Core business rules and logic.
- **Infrastructure**: Handles data access and external services. Here you have adapters, repositories, etc.
- **Services**: Encapsulates different services and operations.
- **Usecases**: Contains the business logic and rules.
- **Controllers**: Handles HTTP requests and responses.
