define({ "api": [
  {
    "type": "get",
    "url": "/",
    "title": "Retrieve the main page of the site",
    "group": "Default",
    "name": "FrontPage",
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Default"
  },
  {
    "type": "get",
    "url": "/ping",
    "title": "Ping the server",
    "name": "Ping",
    "group": "Ping",
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "Ping"
  },
  {
    "type": "post",
    "url": "/register",
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
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/register",
    "title": "Request registration page",
    "name": "CreateUserPage",
    "group": "User",
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/login",
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
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/logout",
    "title": "Log a user out",
    "name": "LogoutUser",
    "group": "User",
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/login",
    "title": "Request Login Page",
    "name": "RequestLogin",
    "group": "User",
    "version": "0.0.0",
    "filename": "routes/index.js",
    "groupTitle": "User"
  }
] });
