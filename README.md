# ITComputers API Documentation

This API provides access to the `computers` table in the database. It supports operations to get a specific computer, get the count of computers, search for computers, and filter computers.

## Get a Specific Computer

To get a specific computer, make a GET request to the API with the `id` parameter.

```
GET /db.php?id=1
```

This will return a JSON object representing the computer with the id of 1. If no computer is found with the provided id, it will return a 404 status code and a JSON object with a "Computer not found" message.

## Get Computer Count

To get the count of computers, make a GET request to the API with the `count` parameter.

```
GET /db.php?count
```

This will return a JSON object with the count of computers.

## Search Computers

To search for computers, make a GET request to the API with the `search` parameter. You can also provide `limit`, `offset`, and `ascending` parameters to limit the number of results and sort them.

```
GET /db.php?search=Dell&limit=10&offset=0&ascending=true
```

This will return a JSON object with an array of computers that match the search term and the count of computers in the array. If no computers are found, it will return a 404 status code and a JSON object with a "No computers found" message.

## Filter Computers

To filter computers, make a GET request to the API with the `filter` parameter. The `filter` parameter should be a JSON-encoded array of filters. You can also provide `limit`, `offset`, and `ascending` parameters to limit the number of results and sort them.

```
GET /db.php?filter=[{"column":"make","value":"Dell"},{"column":"condition","value":1}]&limit=10&offset=0&ascending=true
```

This will return a JSON object with an array of computers that match the filters and the count of computers in the array. If no computers are found, it will return a 404 status code and a JSON object with a "No computers found" message.