# ITComputers API Documentation

This API provides access to the `computers` table in the database. It supports operations to get a specific computer, get the count of computers, search for computers, and filter computers.
## Get Requests

This API provides several GET endpoints to retrieve data from the `computers` table in the database.

### Get a Specific Computer

To get a specific computer, make a GET request to the API with the `id` parameter.

```
GET /db.php?id=1
```

This will return a JSON object representing the computer with the id of 1. If no computer is found with the provided id, it will return a 404 status code and a JSON object with a "Computer not found" message.

### Get Computer Count

To get the count of computers, make a GET request to the API with the `count` parameter.

```
GET /db.php?count
```

This will return a JSON object with the count of computers.

### Search Computers

To search for computers, make a GET request to the API with the `search` parameter. You can also provide `limit`, `offset`, and `ascending` parameters to limit the number of results and sort them.

```
GET /db.php?search=Dell&limit=10&offset=0&ascending=true
```

This will return a JSON object with an array of computers that match the search term and the count of computers in the array. If no computers are found, it will return a 404 status code and a JSON object with a "No computers found" message.

### Filter Computers

To filter computers, make a GET request to the API with the `filter` parameter. The `filter` parameter should be a JSON-encoded array of filters. You can also provide `limit`, `offset`, and `ascending` parameters to limit the number of results and sort them.

```
GET /db.php?filter=[{"column":"make","value":"Dell"},{"column":"condition","value":1}]&limit=10&offset=0&ascending=true
```

This will return a JSON object with an array of computers that match the filters and the count of computers in the array. If no computers are found, it will return a 404 status code and a JSON object with a "No computers found" message.
## Create a New Computer

To create a new computer, make a POST request to the API with the following parameters in the body:

- `asset_number`: The asset number of the computer.
- `make`: The make of the computer.
- `model`: The model of the computer.
- `condition`: The condition of the computer.
- `device_type`: The type of the device.
- `primary_user`: The primary user of the computer.
- `location`: The location of the computer.
- `additional_information`: Additional information about the computer.
- `notes`: Notes about the computer.

Here's an example of how to make the request with curl:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
    "asset_number": "12345",
    "make": "Dell",
    "model": "XPS 15",
    "condition": "New",
    "device_type": "Laptop",
    "primary_user": "John Doe",
    "location": "Office",
    "additional_information": "16GB RAM, 512GB SSD",
    "notes": "For software development"
}' /db.php
```

This will return a JSON object with the id of the new computer. If there was an error creating the computer, it will return a 500 status code and a JSON object with an "Error creating computer" message.

## Update a Computer

To update a computer, make a PUT request to the API with the `id` parameter in the URL and the following parameters in the body:

- `asset_number`: The asset number of the computer.
- `make`: The make of the computer.
- `model`: The model of the computer.
- `condition`: The condition of the computer.
- `device_type`: The type of the device.
- `primary_user`: The primary user of the computer.
- `location`: The location of the computer.
- `additional_information`: Additional information about the computer.
- `notes`: Notes about the computer.

Here's an example of how to make the request with curl:

```bash
curl -X PUT -H "Content-Type: application/json" -d '{
    "asset_number": "12345",
    "make": "Dell",
    "model": "XPS 15",
    "condition": "Used",
    "device_type": "Laptop",
    "primary_user": "John Doe",
    "location": "Home",
    "additional_information": "16GB RAM, 512GB SSD",
    "notes": "For software development"
}' /db.php?id=1
```

This will return a JSON object with the id of the updated computer. If there was an error updating the computer, it will return a 500 status code and a JSON object with an "Error updating computer" message.


## Delete a Computer

To delete a computer, make a DELETE request to the API with the `id` parameter in the URL.

Here's an example of how to make the request with curl:

```bash
curl -X DELETE /db.php?id=1
```

This will return a JSON object with a message indicating the computer was deleted. If there was an error deleting the computer, it will return a 500 status code and a JSON object with an "Error deleting computer" message.