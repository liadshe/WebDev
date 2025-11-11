# WebDevProject

This project is a web application for browsing and watching video content. It allows users to register, log in, manage user profiles, and watch movies and series.

## Architecture

The application follows a Model-View-Controller (MVC) like architecture with a distinct service layer to separate business logic from request handling.

-   **`index.js`**: The main entry point of the application. It sets up the Express server, connects to the MongoDB database, configures middleware, and registers the application's routes.

-   **`routes/`**: This directory contains two subdirectories: `api/` and `views/`.
    -   `api/`: Defines API endpoints that return JSON data.
    -   `views/`: Defines routes that render EJS views.

-   **`controllers/`**: These files handle incoming HTTP requests. They process user input, interact with the service layer to perform business logic, and then render a view or return a JSON response.

-   **`services/`**: This layer contains the core business logic of the application. Services are responsible for interacting with the database models and performing complex operations. This keeps the controllers thin and focused on handling the request-response cycle.

-   **`models/`**: Defines the Mongoose schemas for the application's data structures, such as `User`, `Content`, `Episode`, and `Log`.

-   **`views/`**: Contains the EJS templates for the user interface. These files are rendered by the controllers and sent to the client.

-   **`public/`**: Holds all static assets, including CSS stylesheets, client-side JavaScript files, and images.

-   **`middlewares/`**: Contains Express middleware functions. This includes middleware for checking user authentication (`ensureAuth`) and verifying admin privileges (`checkAdmin`).

## Data Flow

A typical request in this application follows this flow:

1.  An HTTP request hits an endpoint defined in the `routes/` directory.
2.  The route forwards the request to the appropriate controller function in the `controllers/` directory.
3.  If the route is protected, a middleware function (from `middlewares/`) is executed first to check for authentication or authorization.
4.  The controller function calls one or more methods from the `services/` directory to execute the required business logic.
5.  The service methods interact with the Mongoose models in the `models/` directory to query or update the database.
6.  The service returns the result to the controller.
7.  The controller then either renders an EJS template from the `views/` directory with the data or sends a JSON response.

## Code Analysis

### Logging

The application has a centralized `logService` that writes structured logs to the database. 

## Setup and Running the Application

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root of the project and add the following variables:
    ```
    DB_CONNECTION=<Your_MongoDB_Connection_String>
    PORT=<Port_Number>
    OMDB_API_KEY=<Your_OMDb_API_Key>
    ```

3.  **Run the Application**:
    ```bash
    npm start
    ```
    This will start the server with `nodemon`, which automatically restarts the application when file changes are detected.
