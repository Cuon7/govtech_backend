# Education Connection Backend

## Overview
Education sytem is a backend service designed to help teachers perform administrative functions for their students. It's built using the NestJS framework, offering robust API endpoints for clients.

## Table Of Content
- [Overview](#overview)
- [Table Of Content](#table-of-content)
- [Tech stacks](#tech-stacks)
- [Source structure](#source-structure)
- [How to run](#how-to-run)
  - [Pre-requisites](#pre-requisites)
  - [Installation](#installation)
  - [Environment setup](#environment-setup)
  - [Seeding](#seeding)
- [Development](#development)
- [Contact](#contact)

## Features
- Teacher can register students.
- Teacher can retrieve a list of students common to a given list of teachers.
- Teacher can suspend a specified student.
- Teacher can retrieve a list of students who can receive a given notification.

## Tech stacks
- **Backend Framework**: NestJS
- **Database**: MySQL with TypeORM
- **Testing**: Jest
- **Code Formatting and Linting**: ESLint, Prettier


## Source structure
```tree
...
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── entities/
│   │     ├── student.entity.ts
│   │     └── register.dto.ts
│   │     └── suspend.dto.ts
│   ├── dtos/
│   │     ├── notification.dto.ts
│   │     └── teacher.entity.ts
│   ├── modules/
│   │     └── teacher/
│   │           ├── teacher.controller.ts
│   │           ├── teacher.module.ts
│   │           ├── teacher.service.ts
│   │           ├── teacher.controller.spec.ts
│   ├── seed/
│   │     └── seed.service.ts
├── .env
├── package.json
├── yarn.lock
└── README.md
```

## How to run
### Pre-requisites
- Node.js v18.19.0
- Postman

### Installation
To install the project, follow these steps:

```bash
git clone https://github.com/Cuon7/govtech_backend.git
cd govtech_backend
```

### Environment setup

To run this project, you will need to set up the following environment variables. You can do this by creating a `.env` file in the root directory.
```plaintext
# MySQL Database
#===
DB_HOST=YOUR_DB_HOST
DB_PORT=YOUR_DB_PORT
DB_USER=YOUR_USER_NAME
DB_PASS=YOUR_PASSWORD
DB_NAME=YOUR_DB_NAME
```

### Seeding

After the server is successfully up and running, if there is no data in the table, the app will automatically seed data.

## Development
### Start application
```bash
yarn start dev
```

### Run test
To run tests:
```bash
yarn test
```

## Contact
- Email: cuon7.work@gmail.com
- Github: cuon7