define({ "api": [
  {
    "type": "get",
    "url": "/",
    "title": "Retrieve the main page of the site",
    "group": "Default",
    "name": "FrontPage",
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Default",
    "sampleRequest": [
      {
        "url": "https://localhost:3000/"
      }
    ]
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Retrieve the main page of the site",
    "group": "Default",
    "name": "FrontPage",
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "Default",
    "sampleRequest": [
      {
        "url": "https://localhost:3000/users"
      }
    ]
  },
  {
    "type": "get",
    "url": "/users/ping",
    "title": "Ping the server",
    "name": "Ping",
    "group": "Ping",
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "Ping",
    "sampleRequest": [
      {
        "url": "https://localhost:3000/users/ping"
      }
    ]
  },
  {
    "type": "post",
    "url": "/users/register",
    "title": "Request User information",
    "name": "CreateUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The desired username of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>The desired password of the user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The username of the user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: HTTP/1.1 200 OK { \"username\":",
          "content": "\"John\" }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AlreadyExists",
            "description": "<p>Username already exists</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: HTTP/1.1 409 Conflict { \"error\":",
          "content": "\"AlreadyExists\" }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "https://localhost:3000/users/register"
      }
    ]
  },
  {
    "type": "get",
    "url": "/users/register",
    "title": "Request registration page",
    "name": "CreateUserPage",
    "group": "User",
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "https://localhost:3000/users/register"
      }
    ]
  },
  {
    "type": "post",
    "url": "/users/login",
    "title": "Log a user in",
    "name": "LoginUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The id of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>The password of the user</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The username of the user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response: HTTP/1.1 200 OK { \"username\":",
          "content": "\"John\" }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "JSON",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The <code> username </code> of the User was not found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response: HTTP/1.1 404 Not Found { \"error\":",
          "content": "\"UserNotFound\" }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "https://localhost:3000/users/login"
      }
    ]
  },
  {
    "type": "get",
    "url": "/users/logout",
    "title": "Log a user out",
    "name": "LogoutUser",
    "group": "User",
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "https://localhost:3000/users/logout"
      }
    ]
  },
  {
    "type": "get",
    "url": "/users/login",
    "title": "Request Login Page",
    "name": "RequestLogin",
    "group": "User",
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User",
    "sampleRequest": [
      {
        "url": "https://localhost:3000/users/login"
      }
    ]
  }
] });
