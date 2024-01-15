<?php

enum Condition: int
{
    case New = 0;
    case Good = 1;
    case Used = 2;
    case Refurbished = 3;
    case Broken = 4;
}

enum DeviceType: int
{
    case Desktop = 0;
    case Laptop = 1;
    case Tablet = 2;
    case Phone = 3;
    case Server = 4;
    case Printer = 5;
    case Other = 6;
}

enum OperatingSystem: int
{
    case Windows = 0;
    case MacOS = 1;
    case Linux = 2;
    case ChromeOS = 3;
    case Android = 4;
    case iOS = 5;
    case Umix = 6;
    case Other = 7;
}

class Computer
{
    public int $id;
    public int $asset_number;
    public string $make;
    public string $model;
    public Condition $condition;
    public DeviceType $device_type;
    public string $primary_user;
    public string $location;
    public array $additional_information;
    public string $notes;
    public DateTime $created_date;
    public DateTime $modified_date;

    function __construct(int $asset_number, string $make, string $model, Condition $condition, DeviceType $device_type, string $primary_user, string $location, array $additional_information, string $notes)
    {
        $this->id = 0;
        $this->asset_number = $asset_number;
        $this->make = $make;
        $this->model = $model;
        $this->condition = $condition;
        $this->device_type = $device_type;
        $this->primary_user = $primary_user;
        $this->location = $location;
        $this->additional_information = $additional_information;
        $this->notes = $notes;
        $this->created_date = new DateTime();
        $this->modified_date = new DateTime();
    }
}

class ITComputers
{
    private $db;
    /**
     * The constructor for the ITComputers class.
     * It connects to the database and creates the `computers` table if it doesn't exist.
     */
    function __construct()
    {
        require_once "config.inc.php";
        $this->db = DB_Connect::connect();

        // Create tables if they don't exist
        $this->db->query("CREATE TABLE IF NOT EXISTS `computers` 
        (`id` INT NOT NULL AUTO_INCREMENT,
        `asset_number` INT NOT NULL,
        `make` VARCHAR(255) NOT NULL,
        `model` VARCHAR(255) NULL DEFAULT NULL,
        `condition` TINYINT NOT NULL DEFAULT 0,
        `device_type` TINYINT NOT NULL DEFAULT 0,
        `operating_system` TINYINT NOT NULL,
        `available` TINYINT NOT NULL DEFAULT 1,
        `primary_user` VARCHAR(255) NOT NULL,
        `location` VARCHAR(255) NOT NULL,
        `additional_information` JSON NOT NULL,
        `notes` TEXT NOT NULL,
        `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `modified_date` TIMESTAMP NULL DEFAULT NULL,
        PRIMARY KEY (`id`))
        ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    }

    /**
     * This function retrieves a computer from the database by its id.
     *
     * @param int $id The id of the computer to retrieve.
     * @return Computer The computer object.
     * @throws Exception If no computer is found with the provided id, or if more than one computer is found with the same id.
     */
    function getComputer(int $id): Computer
    {
        // Prepare a SQL statement to select a computer from the `computers` table by its `id`.
        $stmt = $this->db->prepare("SELECT * FROM `computers` WHERE `id` = ?");

        // Bind the `id` parameter to the prepared statement.
        $stmt->bind_param("i", $id);

        // Execute the prepared statement.
        $stmt->execute();

        // Get the result of the executed statement.
        $result = $stmt->get_result();

        // If no rows were returned, throw an exception.
        if ($result->num_rows === 0) {
            throw new Exception('No computer found with the provided id');
        }

        // If more than one row was returned, throw an exception.
        if ($result->num_rows > 1) {
            throw new Exception('More than one computer found with the same id. Id should be unique.');
        }

        // Fetch the first (and only) row of the result set.
        $row = $result->fetch_assoc();

        // Create a new Computer object using the data from the row.
        $computer = new Computer(
            $row["asset_number"],
            $row["make"],
            $row["model"],
            $row["condition"],
            $row["device_type"],
            $row["primary_user"],
            $row["location"],
            $row["additional_information"],
            $row["notes"],
        );

        // Set the `id`, `created_date`, and `modified_date` properties of the Computer object.
        $computer->id = $row["id"];
        $computer->created_date = $row["created_date"];
        $computer->modified_date = $row["modified_date"];

        // Return the Computer object.
        return $computer;
    }

    /**
     * This function retrieves all computers from the database.
     *
     * @return array An array of Computer objects.
     */
    function getComputers(): array
    {
        // Prepare a SQL statement to select all rows from the `computers` table.
        $stmt = $this->db->prepare("SELECT * FROM `computers`");

        // Execute the prepared statement.
        $stmt->execute();

        // Get the result of the executed statement.
        $result = $stmt->get_result();

        // Initialize an empty array to hold the computers.
        $computers = array();

        // Loop through each row in the result set.
        while ($row = $result->fetch_assoc()) {
            // Create a new Computer object using the data from the current row.
            $computer = new Computer(
                $row["asset_number"],
                $row["make"],
                $row["model"],
                $row["condition"],
                $row["device_type"],
                $row["primary_user"],
                $row["location"],
                $row["additional_information"],
                $row["notes"]
            );

            // Set the id, created_date, and modified_date properties of the Computer object.
            $computer->id = $row["id"];
            $computer->created_date = $row["created_date"];
            $computer->modified_date = $row["modified_date"];

            // Add the Computer object to the computers array.
            array_push($computers, $computer);
        }

        // Return the array of Computer objects.
        return $computers;
    }

    /**
     * This function adds a new computer to the database.
     *
     * @param Computer $computer The computer object to add.
     * @return bool Returns true if the operation was successful, false otherwise.
     */
    function addComputer(Computer $computer): bool
    {
        $stmt = $this->db->prepare("INSERT INTO `computers` (`asset_number`, `make`, `model`, `condition`, `device_type`, `primary_user`, `location`, `additional_information`, `notes`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssissss", $computer->asset_number, $computer->make, $computer->model, $computer->condition, $computer->device_type, $computer->primary_user, $computer->location, $computer->additional_information, $computer->notes);
        $stmt->execute();
        return $stmt->affected_rows > 0;
    }

    /**
     * This function updates an existing computer in the database.
     *
     * @param Computer $computer The computer object to update.
     * @return bool Returns true if the operation was successful, false otherwise.
     */
    function updateComputer(Computer $computer): bool
    {
        $stmt = $this->db->prepare("UPDATE `computers` SET `asset_number` = ?, `make` = ?, `model` = ?, `condition` = ?, `device_type` = ?, `primary_user` = ?, `location` = ?, `additional_information` = ?, `notes` = ? WHERE `id` = ?");
        $stmt->bind_param("isssissssi", $computer->asset_number, $computer->make, $computer->model, $computer->condition, $computer->device_type, $computer->primary_user, $computer->location, $computer->additional_information, $computer->notes, $computer->id);
        $stmt->execute();
        return $stmt->affected_rows > 0;
    }

    /**
     * This function deletes a computer from the database.
     *
     * @param int $id The id of the computer to delete.
     * @return bool Returns true if the operation was successful, false otherwise.
     */
    function deleteComputer(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM `computers` WHERE `id` = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->affected_rows > 0;
    }

    /**
     * This function returns the total count of computers in the database.
     *
     * @return int The total count of computers.
     */
    function getComputerCount(): int
    {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM `computers`");
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        return $row["COUNT(*)"];
    }


    /**
     * Searches for computers in the database based on a query string.
     * @param string $query The query string to search for.
     * @param int $limit The maximum number of results to return.
     * @param int $offset The number of results to skip.
     * @param bool $ascending Whether to sort the results in ascending or descending order.
     * @return array An array of Computer objects that match the search criteria.
     * @example searchComputers("Dell", 10, 0, true) returns an array of the first 10 computers with "Dell" in any of the columns, sorted by asset number in ascending order.
     */
    function searchComputers(string $query, int $limit, int $offset, bool $ascending): array
    {
        // Prepare a SQL statement to select all columns from the `computers` table where any of the specified columns
        // contain the query string. The results are ordered by `asset_number` in either ascending or descending order,
        // and the number of results is limited with an offset for pagination.
        $stmt = $this->db->prepare("SELECT * FROM `computers` WHERE `asset_number` LIKE ? OR `make` LIKE ? OR `model` LIKE ? OR `primary_user` LIKE ? OR `location` LIKE ? OR `notes` LIKE ? ORDER BY `asset_number` " . ($ascending ? "ASC" : "DESC") . " LIMIT ? OFFSET ?");

        // The query string is wrapped in '%' to allow for partial matches in the SQL LIKE clause.
        $query = "%" . $query . "%";

        // Bind the parameters to the prepared statement. The same query string is used for all LIKE clauses,
        // and the limit and offset are also bound to the statement.
        $stmt->bind_param("ssssssii", $query, $query, $query, $query, $query, $query, $limit, $offset);

        // Execute the prepared statement.
        $stmt->execute();

        // Get the result of the executed statement.
        $result = $stmt->get_result();

        // Initialize an empty array to hold the Computer objects.
        $computers = array();

        // Loop through each row in the result set.
        while ($row = $result->fetch_assoc()) {
            // Create a new Computer object for each row, using the data from the row.
            $computer = new Computer(
                $row["asset_number"],
                $row["make"],
                $row["model"],
                $row["condition"],
                $row["device_type"],
                $row["primary_user"],
                $row["location"],
                $row["additional_information"],
                $row["notes"]
            );

            // Set the id, created_date, and modified_date properties of the Computer object.
            $computer->id = $row["id"];
            $computer->created_date = $row["created_date"];
            $computer->modified_date = $row["modified_date"];

            // Add the Computer object to the array.
            array_push($computers, $computer);
        }

        // Return the array of Computer objects.
        return $computers;
    }

    /**
     * Filters computers in the database based on an array of filters.
     * @param array $filters An array of filters to apply to the query.
     * @param int $limit The maximum number of results to return.
     * @param int $offset The number of results to skip.
     * @param bool $ascending Whether to sort the results in ascending or descending order.
     * @return array An array of Computer objects that match the filter criteria.
     * @example filterComputers([["column" => "make", "value" => "Dell"], ["column" => "condition", "value" => 1]], 10, 0, true) returns an array of the first 10 computers that have "Dell" in the "make" column and "1" in the "condition" column, sorted by asset number in ascending order.
     */
    public function filterComputers(array $filters, int $limit, int $offset, bool $ascending): array
    {
        // Initialize the query string with the SELECT statement.
        $query = "SELECT * FROM `computers` WHERE ";

        // Initialize an empty array to hold the parameters for the prepared statement.
        $params = array();

        // Loop through each filter in the filters array.
        foreach ($filters as $filter) {
            // Append the filter's column and a placeholder to the query string.
            $query .= "`" . $filter["column"] . "` = ? AND ";
            // Add the filter's value to the parameters array.
            array_push($params, $filter["value"]);
        }

        // Remove the trailing " AND " from the query string.
        $query = substr($query, 0, -5);

        // Append the ORDER BY and LIMIT clauses to the query string.
        $query .= " ORDER BY `asset_number` " . ($ascending ? "ASC" : "DESC") . " LIMIT ? OFFSET ?";

        // Add the limit and offset to the parameters array.
        array_push($params, $limit);
        array_push($params, $offset);

        // Prepare the SQL statement.
        $stmt = $this->db->prepare($query);

        // Bind the parameters to the prepared statement.
        $stmt->bind_param(str_repeat("s", count($params)), ...$params);

        // Execute the prepared statement.
        $stmt->execute();

        // Get the result of the executed statement.
        $result = $stmt->get_result();

        // Initialize an empty array to hold the Computer objects.
        $computers = array();

        // Loop through each row in the result set.
        while ($row = $result->fetch_assoc()) {
            // Create a new Computer object using the data from the row.
            $computer = new Computer(
                $row["asset_number"],
                $row["make"],
                $row["model"],
                $row["condition"],
                $row["device_type"],
                $row["primary_user"],
                $row["location"],
                $row["additional_information"],
                $row["notes"]
            );

            // Set the id, created_date, and modified_date properties of the Computer object.
            $computer->id = $row["id"];
            $computer->created_date = $row["created_date"];
            $computer->modified_date = $row["modified_date"];

            // Add the Computer object to the computers array.
            array_push($computers, $computer);
        }

        // Return the array of Computer objects.
        return $computers;
    }
}
