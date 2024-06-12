## ITComputers API Documentation

This document provides a guide for interacting with the ITComputers API.

### API Overview

This API offers access to a database table containing computer information. You can use it to:

* Retrieve a list of devices (GET `/`)
* Add multiple new computers (POST `/`)
* Get unique values for a specific column (GET `/unique/{column}`)
* Get details of a computer by its ID (GET `/{id}`)
* Update an existing computer (PATCH `/{id}`)
* Delete a computer (DELETE `/{id}`)

**Base URL:** https://{environment}[invalid URL removed] (replace `{environment}` with your desired environment: production, staging, or development)

**Authentication:** No authentication is mentioned in this documentation.

**Content-Type:** Unless specified otherwise, requests require a `Content-Type` header set to `application/json`.

**Accept:** Unless specified otherwise, responses are formatted in JSON.


### Endpoints

#### Get a List of Devices (GET `/`)

This endpoint retrieves a list of computers from the database.

**Optional Parameters:**

* `limit`: Limits the number of returned computers (integer).
* `page`: Used for pagination (integer).
* `sort`: Sorts results by a specific field (string).
* `ascending`: Defines sorting order (boolean: true for ascending, false for descending).
* `query`: Searches for computers based on a search term (string).

**Response:**

* Status Code: 200 (Success) - Returns an array of computer objects.


#### Add Multiple New Computers (POST `/`)

This endpoint allows adding multiple new computers in a single request.

**Request Body:**

* An array of computer objects. Each object should contain the following properties:
    * `asset_number`: Unique identifier for the computer (string).
    * `make`: Computer manufacturer (string).
    * `model`: Computer model (string).
    * `location`: Physical location of the computer (string).
    * `primary_user`: Primary user assigned to the computer (string).
    * `operating_system`: Operating system installed (string).
    * `condition`: Condition of the computer (integer).
    * `type`: Type of computer (integer).
    * `available`: Availability status (integer).
    * `specs`: Optional object containing additional specifications (object).
    * `notes`: Optional notes about the computer (string).

**Example Request Body:**

```json
[
  {
    "asset_number": "51965",
    "make": "hp",
    "model": "",
    "location": "50 ind",
    "primary_user": "pricing 50 ind",
    "operating_system": "windows 10 home",
    "condition": 5,
    "type": 1,
    "available": 0,
    "specs": {},
    "notes": "Compatible with Windows 11 - not loaded yet"
  },
  // ... other computer objects
]
```

**Response:**

* Status Code: 200 (Success) - Returns an empty object upon successful creation.


#### Get Unique Values (GET `/unique/{column}`)

This endpoint retrieves a list of unique values for a specified column in the computer table.

**Path Parameter:**

* `{column}`: The name of the column to retrieve unique values for (string).

**Response:**

* Status Code: 200 (Success) - Returns an array containing the unique values.


#### Get a Computer by ID (GET `/{id}`)

This endpoint retrieves details of a specific computer by its ID.

**Path Parameter:**

* `{id}`: The unique identifier of the computer (string).

**Response:**

* Status Code: 200 (Success) - Returns a computer object containing its details.


#### Update a Computer (PATCH `/{id}`)

This endpoint allows updating properties of an existing computer.

**Path Parameter:**

* `{id}`: The unique identifier of the computer to update (string).

**Request Body:**

* An object containing the properties to be updated. Only include the properties you want to modify.

**Response:**

* Status Code: 200 (Success) - Returns the updated computer object.
* Status Code: 500 (Internal Server Error) -  If the update fails.


#### Delete a Computer (DELETE `/{id}`)

This endpoint removes a computer from the database.

**Path Parameter:**

* `{id}`: The unique identifier of the computer to delete (string).

**Response:**

* Status Code: 200 (Success) - Returns an empty object upon successful