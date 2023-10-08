# Data Migration Project

This is a data migration project that allows you to upload CSV files containing information about departments, hired employees, and jobs. The uploaded data is processed and stored in a SQLite database.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

## Prerequisites

- Node.js and npm installed on your computer.
- SQLite database installed (or you can use an online service like SQLite Online).

## Installing

1. Clone the repository to your local machine:
```bash
git clone https://github.com/Eugenioxyz/data-migration-test.git
```
2. Navigate to the project directory:
  ```bash
   cd data-migration-project
   ```
3. Install project dependencies:
  ```bash
    npm install
   ```
## Running the Application
1. Start the server:
  ```bash
    npm start
   ```
This will start the Express.js server, and it will listen on port 3000 by default. You can change the port in the app.js file.

2. Access the application in your web browser at http://localhost:3000.

## Uploading Data
Use this API endpoint to upload CSV files containing department, hired employee, and job data.

- **URL**: `/migration/upload`
- **Method**: `POST`
- **Headers**: Content-Type: `multipart/form-data`

You can upload three CSV files:

- `departments.csv`: Contains department information.
- `hired_employees.csv`: Contains information about hired employees.
- `jobs.csv`: Contains job information.

#### Response Example

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Data uploaded successfully!"
}
```
#### Additional Notes

- If any of the required files are missing in the request, you will receive a `400 Bad Request` response with an error message.
- The uploaded data will be processed and stored in the database for further analysis.

  
## Metrics
### Metrics API

The Metrics API provides data related to employees hired for each job and department in 2021, as well as information about departments that hired more employees than the departmental average in 2021.
#### Hired by Quarter

Use this API endpoint to retrieve data on the number of employees hired for each job and department in 2021, divided by quarter.

- **URL**: `/metrics/hired-by-quarter`
- **Method**: `GET`

##### Response Example

```json
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "department": "Sales",
    "job": "Manager",
    "Q1": 5,
    "Q2": 8,
    "Q3": 6,
    "Q4": 7
  },
  {
    "department": "Engineering",
    "job": "Developer",
    "Q1": 10,
    "Q2": 15,
    "Q3": 12,
    "Q4": 14
  }
]
```
#### Above Average Hires

Use this API endpoint to retrieve a list of departments that hired more employees than the mean of employees hired in 2021.

- **URL**: `/metrics/above-average-hires`
- **Method**: `GET`
##### Response Example

```json
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "department": "Sales",
    "hired": 120
  },
  {
    "id": 2,
    "department": "Engineering",
    "hired": 150
  }
]
```

## Built With
- Node.js - JavaScript runtime for the server.
- Express.js - Web framework for building APIs.
- SQLite - Database for storing uploaded data.
