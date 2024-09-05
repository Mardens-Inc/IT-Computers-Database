<?php


namespace ITComputersDatabase;

use Hashids\Hashids;

/**
 * Class ITComputers
 * @package ITComputersDatabase
 * `id`               int primary key auto_increment,
 * `asset_number`     varchar(30) not null,
 * `make`             varchar(128) default null,
 * `model`            varchar(128) default null,
 * `condition`        tinyint      default 0,
 * `location`         varchar(255) default null,
 * `primary_user`     varchar(255) default null,
 * `operating_system` varchar(255) default null,
 * `type`             tinyint      default 0,
 * `available`        tinyint      default 0,
 * `specs`            text         default null,
 * `notes`            text         default null,
 * `creation_date`    datetime     default current_timestamp,
 * `last_update`      datetime     default current_timestamp on update current_timestamp
 */
class ITComputers
{
    private \mysqli $conn;
    private Hashids $hashids;

    public function __construct()
    {
        $conn = mysqli_connect("localhost", "drew", "9bc9f6b264724051", "general");
        if (!$conn || $conn->connect_error)
        {
            die(json_encode(["error" => "Failed to connect to the database " . $conn->connect_error]));
        }
        $this->conn = $conn;
        $this->hashids = new Hashids("ITComputers", 6);
    }

    /**
     * Retrieves all itcomputers.
     *
     * @return array List of itcomputers
     */
    public function all(): array
    {
        $result = $this->conn->query("SELECT * FROM `itcomputers`");
        $rows = [];
        while ($row = $result->fetch_assoc())
        {
            $row["id"] = $this->hashids->encode($row["id"]);
            $row["specs"] = json_decode($row["specs"], true);
            $rows[] = $row;
        }
        return $rows;
    }

    /**
     * Retrieve a range of IT computers based on limit, offset, sort and order criteria.
     *
     * @param int $limit The maximum number of results to return.
     * @param int $page The page for pagination.
     * @param string $sort The column to sort by.
     * @param bool $ascending True if sorting in ascending order, false for descending order.
     * @return array The range of IT computers matching the criteria.
     */
    public function range(int $limit, int $page, string $sort, bool $ascending): array
    {
        $ascending = $ascending ? "ASC" : "DESC";
        $offset = max($limit * $page, 0);
        $stmt = $this->conn->prepare("SELECT * FROM `itcomputers` ORDER BY `$sort` $ascending LIMIT ? OFFSET ?");
        if (!$stmt)
        {
            return ["error" => $this->conn->error, "code" => $this->conn->errno, "message" => "Failed to prepare statement", "stmt" => $stmt];
        }
        $stmt->bind_param("ii", $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        $rows = [];
        while ($row = $result->fetch_assoc())
        {
            $row["id"] = $this->hashids->encode($row["id"]);
            $row["specs"] = json_decode($row["specs"], true);
            $rows[] = $row;
        }
        $total = $this->count();
        return ["data" => $rows, "total" => $total, "count" => count($rows), "limit" => $limit, "offset" => $offset, "page" => $page, "last_page" => floor($this->count() / $limit)];
    }

    public function count(string $query = ""): int
    {
        $result = $this->conn->query("SELECT COUNT(*) FROM `itcomputers` WHERE CONCAT(asset_number, make, operating_system, location, primary_user) LIKE '%$query%'");
        return $result->fetch_row()[0];
    }

    /**
     * Perform a search for IT computers based on query, limit, offset, sort and order criteria.
     *
     * @param string $query The search query.
     * @param int $limit The maximum number of results to return.
     * @param int $page The page for pagination.
     * @param string $sort The column to sort by.
     * @param bool $ascending True if sorting in ascending order, false for descending order.
     * @return array The list of IT computers matching the search criteria.
     */
    public function search(string $query, int $limit, int $page, string $sort, bool $ascending, $type, $condition, $operating_system, $make, $model, $location, $primary_user, $available,): array
    {
        $query = "%" . $query . "%";
        $ascending = $ascending ? "ASC" : "DESC";
        $offset = max($limit * $page, 0);

        $sql = "SELECT * FROM `itcomputers` WHERE CONCAT(asset_number, make, operating_system, location, primary_user) LIKE ? ";
        if ($type)
        {
            $sql .= "AND `type` = $type ";
        }
        if ($condition)
        {
            $sql .= "AND `condition` = $condition ";
        }
        if ($operating_system)
        {
            $sql .= "AND `operating_system` = '$operating_system' ";
        }
        if ($make)
        {
            $sql .= "AND `make` = '$make' ";
        }
        if ($model)
        {
            $sql .= "AND `model` = '$model' ";
        }
        if ($location)
        {
            $sql .= "AND `location` = '$location' ";
        }
        if ($primary_user)
        {
            $sql .= "AND `primary_user` = '$primary_user' ";
        }
        if ($available)
        {
            $sql .= "AND `available` = $available ";
        }
        $sql .= "ORDER BY `$sort` $ascending LIMIT ? OFFSET ?";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sii", $query, $limit, $offset);
        $stmt->execute();
        $result = $stmt->get_result();
        $rows = [];
        while ($row = $result->fetch_assoc())
        {
            $row["id"] = $this->hashids->encode($row["id"]);
            $row["specs"] = json_decode($row["specs"], true);
            $rows[] = $row;
        }
        $total = $this->count($query);
        return ["data" => $rows, "total" => $total, "count" => count($rows), "limit" => $limit, "offset" => $offset, "page" => $page, "last_page" => floor($total / $limit)];
    }

    /**
     * Retrieves a single record from the `itcomputers` table based on the given ID.
     *
     * @param string $id The encoded ID of the record to retrieve.
     *
     * @return array The fetched record as an associative array, or an empty array if the ID is invalid or no record is found.
     */
    public function get(string $id): array
    {
        $id = $this->hashids->decode($id);
        if (empty($id))
        {
            return [];
        }
        $id = $id[0];
        $result = $this->conn->prepare("SELECT * FROM `itcomputers` WHERE `id` = ? limit 1");
        $result->bind_param("i", $id);
        $result->execute();
        $result = $result->get_result();
        $result = $result->fetch_assoc();
        if ($result)
        {
            $result["id"] = $this->hashids->encode($result["id"]);
            $result["specs"] = json_decode($result["specs"], true);
            return $result;
        }
        return [];
    }

    /**
     * Add a new IT computer to the database.
     *
     * @param array $data The data of the IT computer to be added.
     * @return array|bool|string If successful, returns the added IT computer as an array.
     *                          If unsuccessful, returns false.
     *                          If an exception occurs, returns the error message.
     */
    public function add(array $data): array|bool|string
    {
        try
        {
            $data["specs"] = json_encode($data["specs"]);
            $stmt = $this->conn->prepare("INSERT INTO `itcomputers` (`asset_number`, `make`, `model`, `condition`, `location`, `primary_user`, `operating_system`, `type`, `available`, `specs`, `notes`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssisssiiss", $data["asset_number"], $data["make"], $data["model"], $data["condition"], $data["location"], $data["primary_user"], $data["operating_system"], $data["type"], $data["available"], $data["specs"], $data["notes"]);
            if ($stmt->execute())
            {
                return $this->get($this->hashids->encode($stmt->insert_id));
            }
            return false;
        } catch (\Exception $e)
        {
            return $e->getMessage();
        }
    }

    /**
     * Add multiple items to the collection.
     *
     * @param array $items An array of items to add.
     * @return array An array containing the added items.
     */
    public function add_range(array $items): array
    {
        $results = [];
        foreach ($items as $item)
        {
            $response = $this->add($item);
            if ($response)
            {
                $results[] = $response;
            }
        }
        return $results;
    }

    /**
     * Updates a computer record in the database
     *
     * @param string $id The ID of the computer to update
     * @param array $data The new data for the computer
     *
     * @return array|bool The updated computer record or false if update fails
     */
    public function update(string $id, array $data): array|bool
    {
        $id = $this->hashids->decode($id);
        if (empty($id))
        {
            return false;
        }
        $id = $id[0];
        $data["specs"] = json_encode($data["specs"]);
        $stmt = $this->conn->prepare("UPDATE `itcomputers` SET `asset_number` = ?, `make` = ?, `model` = ?, `condition` = ?, `location` = ?, `primary_user` = ?, `operating_system` = ?, `type` = ?, `available` = ?, `specs` = ?, `notes` = ? WHERE `id` = ?");
        $stmt->bind_param("sssisssiissi", $data["asset_number"], $data["make"], $data["model"], $data["condition"], $data["location"], $data["primary_user"], $data["operating_system"], $data["type"], $data["available"], $data["specs"], $data["notes"], $id);
        if ($stmt->execute())
        {
            return $this->get($this->hashids->encode($id));
        }
        return false;
    }

    /**
     * Deletes a record from the `itcomputers` table by its ID.
     *
     * @param string $id The encoded ID of the record to be deleted
     * @return bool True if the record was deleted successfully, false otherwise
     */
    public function delete(string $id): bool
    {
        $id = $this->hashids->decode($id);
        if (empty($id))
        {
            return false;
        }
        $id = $id[0];
        $stmt = $this->conn->prepare("DELETE FROM `itcomputers` WHERE `id` = ? LIMIT 1");
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    public function get_unique_values(string $column): array
    {
        try
        {
            $result = $this->conn->query("SELECT DISTINCT `$column` FROM `itcomputers` order by `$column`");
            $rows = [];
            while ($row = $result->fetch_assoc())
            {
                $rows[] = $row[$column];
            }
            // remove empty arrays
            return array_filter($rows, function ($value)
            {
                return !empty($value);
            });
        } catch (\Exception $e)
        {
            return ["error" => $e->getMessage()];
        }
    }
}