<h1 align="center">Backend Service</h1>
<h4 align="center">API</h4>

## Description

<p>Backend API</p>

## Pre-requisite

- NodeJS 18+ and NestJS cli for local development

## Installation

Clone and install npm package dependencies

```bash
$ git clone <git repo url>
$ cd backend-api
$ git checkout main
$ npm install
```

Run Migration to create the database tables

```bash
$ npm run typeorm:migration:run
```

Copy .env.local to .env

- make sure to update missing variable such as credentials

```bash
$ cp .env.local .env
```
