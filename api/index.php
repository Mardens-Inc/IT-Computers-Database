<?php

// Allow CORS
header("Access-Control-Allow-Origin: *");

// Import the ITComputers class
use ITComputersDatabase\ITComputers;
use Slim\Factory\AppFactory;

// Import the AppFactory class from Slim framework

// Load all the classes from the vendors
require_once $_SERVER["DOCUMENT_ROOT"] . "/vendor/autoload.php";
// Load the ITComputers class
require_once 'ITComputers.inc';

// Create a new instance of the ITComputers class
$computers = new ITComputers();

// Create a new Slim App instance
$app = AppFactory::create();
// Add routing Middleware to handle routes
$app->addRoutingMiddleware();
// Add error Middleware to handle exceptions and Php errors
$app->addErrorMiddleware(true, true, true);
// Set the base path for the route
$app->setBasePath('/api');

// Define route for getting a list of computers
$app->get('/', function ($request, $response, $args) use ($computers) {
    try {
        $params = $request->getQueryParams();
        // If limit param is set, call the search method on computers object
        // Otherwise call the all method to return all computers as json
        if (isset($params["limit"])) {
            $page = $params["page"] ?? 0;
            $sort = $params["sort"] ?? "id";
            $ascending = $params["ascending"] == "true";
            $query = $params["query"] ?? "";
            $type = @$params["type"] ?? "";
            $condition = @$params["condition"] ?? "";
            $operating_system = @$params["operating_system"] ?? "";
            $make = @$params["make"] ?? "";
            $model = @$params["model"] ?? "";
            $location = @$params["location"] ?? "";
            $primary_user = @$params["primary_user"] ?? "";
            $available = @$params["available"] ?? "";
            $response->getBody()->write(json_encode(@$computers->search($query, $params["limit"], $page, $sort, $ascending, $type, $condition, $operating_system, $make, $model, $location, $primary_user, $available)));
        } else
            $response->getBody()->write(json_encode($computers->all()));
        return $response->withHeader('Content-Type', 'application/json');
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(["message" => $e->getMessage()]));
        return $response->withStatus(500)->withHeader("Content-Type", "application/json");
    }
});

// Define GET route to get unique columns
$app->get('/unique/{column}', function ($request, $response, $args) use ($computers) {
    $response->getBody()->write(json_encode($computers->get_unique_values($args["column"])));
    return $response->withHeader('Content-Type', 'application/json');
});

// Define GET route to get computer by id
$app->get('/{id}', function ($request, $response, $args) use ($computers) {
    $response->getBody()->write(json_encode($computers->get($args["id"])));
    return $response->withHeader('Content-Type', 'application/json');
});

// Define POST route to add new computer or computers
$app->post('/', function ($request, $response, $args) use ($computers) {
    $data = $request->getBody()->getContents();
    // If the data is array then call add_range method on computers object
    // Else call add method to add a single computer
    if (is_array(json_decode($data))) {
        $response->getBody()->write(json_encode($computers->add_range(json_decode($data, true))));
    } else
        $response->getBody()->write(json_encode($computers->add(json_decode($data, true))));
    return $response->withHeader('Content-Type', 'application/json');
});

// Define PUT route to update computer
$app->put('/{id}', function ($request, $response, $args) use ($computers) {
    $data = $request->getBody()->getContents();
    $response->getBody()->write(json_encode($computers->update($args["id"], json_decode($data, true))));
    return $response->withHeader('Content-Type', 'application/json');
});

// Define DELETE route to remove computer
$app->delete("/{id}", function ($request, $response, $args) use ($computers) {
    try {
        $id = $args['id'];
        $response->withStatus(200)->getBody()->write(json_encode(["success" => @$computers->delete($id)]));
    } catch (Exception $e) {
        $response->withStatus(500)->getBody()->write(json_encode(["error" => $e, "message" => "Unable to delete '$id'"]));
    }
    return $response->withHeader("Content-Type", "application/json");
});

// Run the application
$app->run();