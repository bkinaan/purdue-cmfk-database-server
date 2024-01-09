# Purdue College Mentors for Kids Database Server

Custom REST API built using Express.js and SQLite.

Built for the [database client](https://github.com/bkinaan/purdue-cmfk-database-client).

## Current Features

### Mentor model

The server contains a mentor model with necessary properties for this database.

### Automatic parsing for mentors

Send an unedited CSV file of any list of mentors from the nationals College Mentors database for automatic parsing and creation of mentors in this database. This CSV file can be for the entire database or only a subset of mentors. The server will automatically create these mentors on this database.

### Security

The server implements JSON Web Tokens (JWT) which are authorized using a username and password. Passwords are hashed using an encryption and never transferred to the client. Only the sign up and sign in links are accessible without a JWT and all other pages require authentication.

For the first time a mentor uses the database, they must activate their account by signing up. This requires their email address as well as the username and password they wish to use for their account. The email address must match the one already linked to their account from the mentor upload. The body of the POST request must must contain the following JSON object format:

```JSON
{
    "EmailAddress": "banda@bobalice.com",
    "username": "bobandalice",
    "password": "sittinginatree"
}
```

To verify an account, the body of the POST request must contain a JSON object with both the username and password:

```JSON
{
    "username": "bobandalice",
    "password": "sittinginatree"
}
```

After successfully signing up or signing in, the server will respond with a JWT. This JWT must be passsed in every subsequent request to the server to access the database.

## What's Coming...

- Automatically store little buddies in the database from a CSV file
- Automatically pair mentors and little buddies on the database from CSV parsing.
- Allow CSV reuploads of mentors that already exist for easy automatic updates
- Gives more automated control to exec/staff members
- Much more...
