# Introduction about the API

Create an advanced API that empowers users to monitor the status and location of products as they move through different stages, such as manufacturing, shipping, and delivery. This API will serve a dual purpose: enabling customers to track their orders in real-time and providing administrators with robust tools to manage and update product statuses seamlessly.

## Tech Stack

- Node.js
- Express
- MongoDB

## Features

#### User Authentication and Authorization:

Implement endpoints for user registration and login, incorporating role-based access control to differentiate between roles (e.g., admin, customer) and manage access to specific functionalities.

#### Product Management:

Implement CRUD operations for products by creating endpoints to add, retrieve, update, and delete products.

#### Tracking Status Updates:

Implement CRUD operations for tracking events by creating endpoints to add, retrieve, update, and delete events such as "created," "in transit," and "delivered." Ensure each tracking event records the timestamp and location.

#### Notification System:

Email Notifications: Send email notifications to users when the product status changes.

## Run Locally

Clone the repository

```bash
  git clone https://github.com/suicide-machine/Backend-Task-Binbag-.git
```

Go to the project directory

```bash
  cd .\Backend-Task-Binbag-\
  cd .\backend\
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Environment Variables

Make Sure to Create a .env file in backend/config directory and add appropriate variables in order to use the api routes.

PORT=

MONGO =

JWT_SECRET_KEY =

SMPT_HOST= smtp.gmail.com

SMPT_PORT= 465

SMPT_MAIL= <Owner's email>

SMPT_PASSWORD =
