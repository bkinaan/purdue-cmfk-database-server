# Purdue College Mentors for Kids Database Server

Custom REST API built using Express.js and SQLite. Security implemented using JWT.

Access using the [database client](https://github.com/bkinaan/purdue-cmfk-database-client).

## Features

### Models

The server contains a mentor model and a buddy model. The mentor model is used for account holders. Buddies contain identifying information, not personal account information. A pairs report can be created and sent to the client. This report can also easily filtered as it uses indexes.

### Security

The server implements JSON Web Tokens (JWT) which are authorized using a username and password. Passwords are hashed using an encryption and never transferred to the client. Only the sign up and login links are accessible without a JWT and all other pages require authentication.

After successfully signing up or logging in, the server will respond with a JWT. This JWT must be passsed in every subsequent request to the server to access the database. The user must request the JWT again after it expires.

Passwords are hashed before being stored. Additionally, when sending mentor inforamtion to a client, the password field is removed for additional security.

### Transactions

All create functions use transactions and a CLS namespace to ensure they are completed properly.
