# NestJS API Example

![CI/CD Actions](https://github.com/rsca7213/express-ts-test/actions/workflows/api.yml/badge.svg)

This is a simple example of an NestJS API written in TypeScript.

## 📚 Prerequisites - Before installing and running the API

- Install the latest LTS of Node.js from [Node.js](https://nodejs.org/en/)
- This should also install npm, the Node.js package manager
- Install Docker Desktop from [Docker](https://www.docker.com/products/docker-desktop/)
- Clone this repository to your local machine

## 🛠️ Installation

- Open a terminal and enter the `docker pull postgres` to grab the latest Postgres version from Docker Hub

- Open a terminal and navigate to the root of the cloned repository

  `cd /path/to/nestjs-ts-test`

- Install the required npm packages

  `npm install`

- Create a `.env` file in the root of the project. You can copy the `.env.template` file and rename it to `.env`

  `cp .env.template .env`

## 🗃️ Configuring the PostgreSQL database

- Add the database connection string to the `.env` file

  `DATABASE_URL=postgresql://username:password@localhost:5432/express_ts_test`

- Finish setting up the environment variables in the `.env` file. Remember the information that you used to set `DATABASE_URL`

- Start the PostgreSQL container, navigate to the root directory containing the `docker-compose.yaml` file in your terminal and run the following command:

  `docker-compose up -d`

- Use a tool for Database Management (Table Plus, VSCode's PostgreSQL DB Plugin, etc.) and create a new connection using the username, password and database name from the `DATABASE_URL` variable in the `.env` file.

- Run the migrations from our Prisma ORM Schema to create the tables in the database

  `npx prisma migrate dev`

- Seed the database with some initial data (⚠️ Don't run this command on a production database, as it will create administrative users with default passwords)

  `npx prisma db seed`
