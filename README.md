# Weekly Report Generator & Team Dashboard

A full-stack web application for submitting, managing, reviewing, and tracking weekly team reports.

**----Tech Stack----**

### Frontend

* React.js
* Axios
* React Router
* CSS

### Backend

* ASP.NET Core Web API
* C#
* Entity Framework Core
* JWT Authentication
* Role-Based Authorization

### Database

* MySQL
* Entity Framework Core Migrations

---

# Setup Instructions

1. Installing Dependencies

Prerequisites

Make sure the following are installed on your computer:

* Node.js and npm
* .NET 8 SDK
* MySQL Server
* MySQL Workbench
* Visual Studio or Visual Studio Code

Clone the Repository

bash
git clone https://github.com/radixSew/Weekly-Report-Generator.git
cd Weekly-Report-Generator


-----------------------------------------------------------------------------------------------------------------------------------------

2. Install Frontend Dependencies

Navigate to the frontend folder:

bash
cd fontend/weekly-report-frontend


Install the required React packages:

bash
npm install


This installs the dependencies listed in `package.json`.

-----------------------------------------------------------------------------------------------------------------------------------------

3. Running the Frontend

From the frontend folder:

bash
cd fontend/weekly-report-frontend


Start the React development server:

bash
npm start


The frontend will normally run at:

text
http://localhost:3000


Open the URL in your browser.

-----------------------------------------------------------------------------------------------------------------------------------------

4. Running the Backend

Open a new terminal window.

Navigate to the backend project:

bash
cd backend/WeeklyReportApi/WeeklyReportApi


Restore the .NET dependencies:

bash
dotnet restore


Build the backend:

bash
dotnet build


Run the API:

bash
dotnet run


The API will run on the URL displayed in the terminal.

For example:

text
https://localhost:7024


The exact port may be different depending on the local configuration.

Swagger

After starting the backend, open the Swagger URL shown by the application, for example:

text
https://localhost:7024/swagger

Swagger can be used to test the backend API endpoints.

-----------------------------------------------------------------------------------------------------------------------------------------

5. Running the Database

This application uses MySQL.

 Step 1: Start MySQL

Open MySQL Workbench and make sure your MySQL Server is running.

 Step 2: Create the Database

Create the database:

sql
CREATE DATABASE weekly_report_db;


Alternatively, the Entity Framework migration can create the database if the configured MySQL user has permission to create databases.

Step 3: Configure the Connection String

Open:

text
backend/WeeklyReportApi/WeeklyReportApi/appsettings.json


Configure the MySQL connection string according to your local MySQL installation.

Example:

json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=weekly_report_db;User=root;Password=YOUR_PASSWORD;"
  }
}


Replace:

text
YOUR_PASSWORD


with your local MySQL password.

Do not commit real passwords or other secrets to GitHub.**

Step 4: Apply Entity Framework Migrations

Navigate to the backend project:

bash
cd backend/WeeklyReportApi/WeeklyReportApi


Run:

bash
dotnet ef database update


This creates/updates the required database tables.

If Entity Framework CLI is not installed, install it using:

bash
dotnet tool install --global dotnet-ef


Then run:

bash
dotnet ef database update


-----------------------------------------------------------------------------------------------------------------------------------------

6. Run the Complete Application

You need two terminals.

Terminal 1 — Backend

bash
cd backend/WeeklyReportApi/WeeklyReportApi
dotnet run


Terminal 2 — Frontend

bash
cd fontend/weekly-report-frontend
npm start


Then open:

http://localhost:3000


The React frontend communicates with the ASP.NET Core Web API.

-----------------------------------------------------------------------------------------------------------------------------------------

# Project Structure


Weekly-Report-Generator/
│
├── backend/
│   └── WeeklyReportApi/
│       └── WeeklyReportApi/
│           ├── Controllers/
│           ├── DTOs/
│           ├── Data/
│           ├── Models/
│           ├── Migrations/
│           ├── Program.cs
│           ├── appsettings.json
│           └── WeeklyReportApi.csproj
│
├── fontend/
│   └── weekly-report-frontend/
│       ├── public/
│       ├── src/
│       ├── package.json
│       └── package-lock.json
│
└── README.md


-----------------------------------------------------------------------------------------------------------------------------------------

# Application Features

* User Registration and Login
* JWT Authentication
* Role-Based Authorization
* Team Member Dashboard
* Weekly Report Creation
* Report Editing
* Project Management
* Manager Dashboard
* Report Review
* Send Reports Back for Correction
* Report Approval
* Report Version History
* Manager Report Analysis

-----------------------------------------------------------------------------------------------------------------------------------------

# Troubleshooting

### Frontend dependencies error

Run:

bash
npm install


Then:

bash
npm start


### Backend build error

Run:

bash
dotnet restore


Then:

bash
dotnet build


### Database migration error

Make sure:

1. MySQL Server is running.
2. The database connection string is correct.
3. The MySQL username and password are correct.

Then run:

bash
dotnet ef database update


### Port already in use

If port `3000` or the backend API port is already being used, stop the application using that port and restart the application.

-----------------------------------------------------------------------------------------------------------------------------------------

# Author
Radhika Sewwandi
Weekly Report Generator & Team Dashboard
