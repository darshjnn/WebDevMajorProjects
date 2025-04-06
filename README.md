# Hotel Catalogue

This is a simple cataloging system where the user can catalogue all the listings for show casing.

## Features: 
1. Login & Sign up functionality.

2. Authentication & Authorization.

3. Implemented MVC (Model, View, Controller) Framework.

4. Perform CRUD Operations on catalogue, add reviews.

5. Used Cloudinary for storing Listing images on cloud.

6. Implemented Error Handling Middlewares.

7. Used '__joi__' for Server-side Schema Validation.

8. Added Comments wherever required.

9. pbkdf2 Hashing Algorithm for Password Hashing.

## Configuring the project:
1. Open the Folder on IDE.

2. Run '__npm install__' on terminal to install all the dependencies.

3. Setup MongoDB and Cloudinary by creating two `.env` files, one in the root, and, the other, inside `init` directory.

4. Add values in `.env` file for `CLOUD_NAME`, `CLOUD_API_KEY` and `CLOUD_API_SECRET`. Add value for `MONGO_URL` for local database, or `ATLASDB_URL` for cloud database setup. Also, add a `SECRET` value with any random string to use with `express-session`.

5. Use `MONGO_URL` value inside `main()` for local connection, else, for cloud connection, use `ATLASDB_URL` value.

6. Add the data of listings by running '__node init.js__' file in the '*__/init__*' directory.

7. Run '__node app.js__' to start the server.

8. Open browser and visit on '__localhost:8080__'.

#### Author: Darsh Jain