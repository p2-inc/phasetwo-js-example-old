# Phase Two Web Client Demo

This project uses Webpack to create a JS app that demonstrates usage of the `phasetwo-js` library.

The web application is served using Node.js and Express.

## Getting Started

```bash
$ npm install     # install npm dependencies
$ npm start       # builds browser app and starts web server
```

## Keycloak Server

This application expects a Keycloak server to be running at `http://localhost:8180`, configured with a client called in `app-html5` in a realm called `quickstart`.

These can be changed by editing the config object in `app.js`.

## Service Application

The application is intended to communicate with the web service application created by the [`phasetwo-nodejs-example`](https://github.com/p2-inc/phasetwo-nodejs-example) project, whose endpoints are protected by [`phasetwo-nodejs`](https://github.com/p2-inc/phasetwo-nodejs) middleware.

However, the application could communicate with any service that implements the same PhaseTwo-protected endpoints.

## Functionality

The application consists of several buttons that make requests to either the service application or directly to the Keycloak server.

The JSON responses of these requests are displayed in box below the buttons.

### • Login

sends the user to the Keycloak login screen for authentication

### • Acct API (Server)

makes a request to the service application for information about the currently authenticated user. This information should look identical to the response from **Acct API (Client)**.

### • Acct API (Client)

makes a request directly to the Keycloak server for information about the currently authenticated user. This information should look identical to the response from **Acct API (Server)**.

### • Invoke Public

makes a request to a public (no authentication required) endpoint on the service application

### • Invoke Secured

makes a request to a secure endpoint on the service application. The request will fail if the user is not currently authenticated.

### • Invoke Admin

makes a request to an admin-only endpoint on the service application. The request will fail if the user is not currently authenticated or if the authenticated user is not an admin for the Keycloak client.
