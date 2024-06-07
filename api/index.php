<?php

use ITComputersDatabase\ITComputers;
use Slim\Factory\AppFactory;

require_once $_SERVER["DOCUMENT_ROOT"] . "/vendor/autoload.php";
require_once 'ITComputers.inc';

$computers = new ITComputers();

$app = AppFactory::create();
$app->addRoutingMiddleware();
$app->addErrorMiddleware(true, true, true);
$app->setBasePath('/api');

$app->get('/', function ($request, $response, $args) use ($computers) {
    try {
        $params = $request->getQueryParams();
        if (isset($params["limit"])) {
            $offset = $params["offset"] ?? 0;
            $response->getBody()->write(json_encode($computers->range($params["limit"], $offset)));
        } else
            $response->getBody()->write(json_encode($computers->all()));
        return $response->withHeader('Content-Type', 'application/json');
    } catch (Exception $e) {
        return $response->withStatus(500)->withHeader("Content-Type", "application/json")->withJson(["message" => $e->getMessage()]);
    }
});

$app->get('/unique/{id}', function ($request, $response, $args) use ($computers) {
    $response->getBody()->write(json_encode($computers->get_unique_values($args["id"])));
    return $response->withHeader('Content-Type', 'application/json');
});
$app->get('/{id}', function ($request, $response, $args) use ($computers) {
    $response->getBody()->write(json_encode($computers->get($args["id"])));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->post('/', function ($request, $response, $args) use ($computers) {
    $data = $request->getBody()->getContents();
    if (is_array(json_decode($data))) {
        $response->getBody()->write(json_encode($computers->add_range(json_decode($data, true))));
    } else
        $response->getBody()->write(json_encode($computers->add(json_decode($data, true))));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->run();