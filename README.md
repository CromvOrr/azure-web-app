# Azure Web App

### Architecture

Diagram below illustrates the architecture of this project,
showing how components are connected and how resources within the resource group interact.

![](../media/awa-diagram.png?raw=true)

### Overview

This repository contains the code for a web application built with Node.js 20 LTS.
The backend leverages the Express framework, following the MVC pattern, and connects to a MySQL database.

The application was initially developed with a local database - which was later
replaced by a MySQL server hosted on Azure,
using my [Azure for Students](https://azure.microsoft.com/en-us/free/students) subscription.

![](../media/awa-rg.png?raw=true)

Once the app successfully connected to the database and functioned as expected,
I decided to host it on Azure App Service, enabling online access to the application.

The plan was to deploy the source code directly from this repository,
using GitHub Actions to trigger the deployment. While the process was straightforward in concept,
I encountered a few challenges along the way.

![](../media/awa-wa.png?raw=true)

After deploying the application on Azure and accessing the website, I was greeted with the following message:

    You do not have permission to view this directory or page.

By accessing the [`Kudu`](https://learn.microsoft.com/en-us/azure/app-service/resources-kudu) console on Azure,
I was able to view the project structure and investigate the issue.

![](../media/awa-kudu.png?raw=true)

The root of the problem took some time to identify because everything initially appeared correct.
Eventually, I discovered the cause - the `node_modules` folder was empty. During the build process,
Azure flagged `bcrypt` as a corrupted package, resulting in the deletion of all modules
and preventing the app from running. Only after replacing [`bcrypt`](https://www.npmjs.com/package/bcrypt)
with [`bcryptjs`](https://www.npmjs.com/package/bcryptjs) was Azure able to successfully build and run the application.
Without Kudu’s functionality, troubleshooting would have been significantly more difficult.

### Summary

In the end, I successfully deployed a functioning web application using Node.js and Express.js,
backed by an [`Azure Database for MySQL Flexible Server`](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/overview)
and hosted on [`Azure App Service`](https://learn.microsoft.com/en-us/azure/app-service/overview).
This project provided valuable experience in deploying applications on Azure,
**with the most significant learning coming from diagnosing and troubleshooting the issues encountered along the way**.

# Setup

This application can be run locally on your computer without setting up Azure Web Services
or an Azure Database MySQL Server. It can be configured to use a local database,
allowing you to start the application quickly.

1. Clone the Repository

```
git clone https://github.com/CromvOrr/azure-web-app.git
```

```
cd azure-web-app
```

2. Install Dependencies

```
npm install
```

3. Configure the Database

```
Ensure your MySQL database is accessible.
```

4. Set up `.env` variables

```
PORT=3000
DB_HOST=127.0.0.1
DB_USER=user
DB_PASSWORD=password
DB_NAME=my_database
DB_PORT=3306
JWT_SECRET=my_secret
```

5. Run the Application

```
npm start
```

6. Access the Application

```
http://localhost:3000
```
