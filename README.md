# Purdue College Mentors for Kids Database Server

Custom REST API built using Express.js and SQLite. Security implemented using JWT.

Access using the [database client](https://github.com/bkinaan/purdue-cmfk-database-client).

## Current Features

### Models

The server contains a mentor model and a buddy model with necessary properties for this database.

### Security

The server implements JSON Web Tokens (JWT) which are authorized using a username and password. Passwords are hashed using an encryption and never transferred to the client. Only the sign up and login links are accessible without a JWT and all other pages require authentication.

After successfully signing up or logging in, the server will respond with a JWT. This JWT must be passsed in every subsequent request to the server to access the database. The user must request the JWT again after it expires.

## What's Coming...

- Awesome stuff
