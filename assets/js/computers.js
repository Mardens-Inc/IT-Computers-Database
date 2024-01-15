class Condition {
    static New = 0;
    static Good = 1;
    static Used = 2;
    static Refurbished = 3;
    static Broken = 4;
}

class DeviceType {
    static Desktop = 0;
    static Laptop = 1;
    static Tablet = 2;
    static Phone = 3;
    static Server = 4;
    static Printer = 5;
    static Other = 6;
}

class OperatingSystem {
    static Windows = 0;
    static MacOS = 1;
    static Linux = 2;
    static ChromeOS = 3;
    static Android = 4;
    static iOS = 5;
    static Umix = 6;
    static Other = 7;
}

class Computer {
    /**
     * Creates a new computer
     * @param {Number} asset_number The asset number of the computer
     * @param {String} make The make of the computer
     * @param {String} model The model of the computer
     * @param {Condition} condition The condition of the computer
     * @param {DeviceType} device_type The type of device
     * @param {OperatingSystem} operating_system The operating system of the computer
     * @param {String} primary_user The primary user of the computer
     * @param {String} location The location of the computer
     * @param {String} additional_information Additional information about the computer
     * @param {String} notes Notes about the computer
     * @returns {Computer} The computer
     */
    constructor(asset_number, make, model, condition, device_type, operating_system, primary_user, location, additional_information, notes) {
        this.id = 0;
        this.asset_number = asset_number;
        this.make = make;
        this.model = model;
        this.condition = condition;
        this.device_type = device_type;
        this.operating_system = operating_system;
        this.primary_user = primary_user;
        this.location = location;
        this.additional_information = additional_information;
        this.notes = notes;
        this.created_date = new Date();
        this.modified_date = new Date();
    }

    /**
     * Creates a new computer from JSON
     * @param {JSON} json The JSON to create the computer from
     * @returns {Computer|false} The computer or false if it couldn't be created
     */
    static fromJSON(json) {
        try {
            const data = JSON.parse(json);
            const computer = new Computer(data.asset_number, data.make, data.model, data.condition, data.device_type, data.operating_system, data.primary_user, data.location, data.additional_information, data.notes);
            computer.id = data.id;
            computer.created_date = new Date(data.created_date);
            computer.modified_date = new Date(data.modified_date);
            return computer;
        } catch (error) {
            return false;
        }
    }
}

class Computers {
    constructor() {
        this.baseUrl = "/api/db.php";
    }

    /**
     * Gets a computer from the database
     * @param {Number} id The id of the computer to get
     * @returns {Computer|false} The computer or false if it doesn't exist
     */
    async getComputer(id) {
        return await $.ajax({
            url: `${this.baseUrl}?id=${id}`,
            method: "GET",
            dataType: "json",
            success: (data) => Computer.fromJSON(data),
            error: () => false,
        });
    }

    /**
     * Gets the number of computers in the database
     * @returns {Number} The number of computers in the database
     */
    async getComputerCount() {
        return await $.ajax({
            url: `${this.baseUrl}?count=true`,
            method: "GET",
            dataType: "json",
            success: (data) => data.count,
        });
    }

    /**
     * Gets a list of computers from the database
     * @param {Number} limit The maximum number of computers to get
     * @param {Number} offset The offset to start at
     * @param {Boolean} ascending True if the computers should be sorted ascending, false otherwise
     * @returns {Array<Computer>} An array of computers
     */
    async searchComputers(search, limit = 10, offset = 0, ascending = true) {
        return await $.ajax({
            url: `${this.baseUrl}?search=${search}&limit=${limit}&offset=${offset}&ascending=${ascending}`,
            method: "GET",
            dataType: "json",
            success: (data) => {
                const computers = [];
                for (const computer of data.computers) {
                    computers.push(Computer.fromJSON(computer));
                }
                return computers;
            },
        });
    }

    /**
     * Gets a list of computers from the database
     * @param {Number} limit The maximum number of computers to get
     * @param {Number} offset The offset to start at
     * @param {Boolean} ascending True if the computers should be sorted ascending, false otherwise
     * @returns {Array<Computer>} An array of computers
     */
    async filterComputers(filter, limit = 10, offset = 0) {
        return await $.ajax({
            url: `${this.baseUrl}?filter=${JSON.stringify(filter)}&limit=${limit}&offset=${offset}`,
            method: "GET",
            dataType: "json",
            success: (data) => {
                const computers = [];
                for (const computer of data.computers) {
                    computers.push(Computer.fromJSON(computer));
                }
                return computers;
            },
        });
    }

    /**
     * Adds a computer to the database
     * @param {Computer} computer The computer to add
     * @returns {JSON} The response from the server
     */
    async addComputer(computer) {
        return await $.ajax({
            url: this.baseUrl,
            method: "POST",
            data: JSON.stringify(computer),
            contentType: "application/json",
            dataType: "json",
            success: (data) => Computer.fromJSON(data),
        });
    }

    /**
     * Updates a computer in the database
     * @param {Number} id The id of the computer to update
     * @param {Computer} computer The computer to update
     * @returns {JSON} The response from the server
     */
    async updateComputer(id, computer) {
        return await $.ajax({
            url: `${this.baseUrl}?id=${id}`,
            method: "PUT",
            data: JSON.stringify(computer),
            contentType: "application/json",
            dataType: "json",
            success: (data) => Computer.fromJSON(data),
        });
    }

    /**
     *  Deletes a computer from the database
     * @param {Number} id The id of the computer to delete
     * @returns {Boolean} True if the computer was deleted, false otherwise
     */
    async deleteComputer(id) {
        return await $.ajax({
            url: `${this.baseUrl}?id=${id}`,
            method: "DELETE",
            dataType: "json",
            success: () => true,
            error: () => false,
        });
    }
}
