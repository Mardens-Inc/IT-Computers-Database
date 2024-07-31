import {FilterResults} from "../components/FilterComputerPopup.tsx";

export interface Computer
{
    id: string,
    asset_number: string,
    make: string,
    model: string,
    condition: string | number,
    location: string,
    primary_user: string,
    operating_system: string,
    type: string | number,
    available: boolean | number,
    specs,
    notes: string,
    creation_date: Date,
    last_update: Date
}

/**
 * Returns the computer type based on the given type code.
 * @param {number} type - The type code representing the computer type.
 * @return {string} - The computer type as a string.
 */
export function GetComputerType(type: number): string
{
    switch (type)
    {
        case 1:
            return "Laptop";
        case 2:
            return "Desktop";
        case 3:
            return "Printer";
        case 4:
            return "Copier";
        case 5:
            return "Phone";
        case 6:
            return "Kiosk";
        case 7:
            return "Tablet";
        default:
            return "Unknown";
    }
}

export function GetComputerCondition(condition: number): string
{
    switch (condition)
    {
        case 1:
            return "Broken";
        case 2:
            return "Good/Used";
        case 3:
            return "Refurbished / Open Box";
        case 4:
            return "Display";
        case 5:
            return "New";
        default:
            return "Unknown";
    }
}

export function GetComputerConditionCode(condition: string): number
{
    switch (condition)
    {
        case "Broken":
            return 1;
        case "Good/Used":
            return 2;
        case "Refurbished / Open Box":
            return 3;
        case "Display":
            return 4;
        case "New":
            return 5;
        default:
            return 0;
    }
}

export function GetComputerTypeCode(type: string): number
{
    switch (type)
    {
        case "Laptop":
            return 1;
        case "Desktop":
            return 2;
        case "Printer":
            return 3;
        case "Copier":
            return 4;
        case "Phone":
            return 5;
        case "Kiosk":
            return 6;
        case "Tablet":
            return 7;
        default:
            return 0;
    }
}

export interface ComputerSearchOptions
{
    query: string,
    sort: string,
    ascending: boolean,
    limit: number,
    page: number,
    filter: FilterResults
}

/**
 * Represents the result of a computer query.
 *
 * @interface ComputerResult
 */
export interface ComputerResult
{
    /**
     * Represents a collection of computer data.
     */
    data: Computer[],
    /**
     * Represents the total number of computers in the database that match the current query.
     */
    total: number,
    /**
     * Represents the count of computers returned.
     *
     */
    count: number,
    /**
     * The limit that was used in the query
     */
    limit: number,
    /**
     * The current page index of the returned results.
     */
    page: number,
    /**
     * The last page based on the current limit and the total number of results.
     */
    last_page: number,
}

/**
 * Retrieves a list of computers based on the provided search options.
 * This method makes an asynchronous HTTP request to the specified API endpoint and returns the result as a Promise.
 *
 * @param {ComputerSearchOptions} options - The search options for filtering the computers.
 * @param {AbortSignal} [signal=null] - The signal used to abort the HTTP request.
 * @returns {Promise<ComputerResult | null>} - A Promise that resolves with the list of computers or null if an error occurs.
 * @throws {Error} - If an error occurs during the HTTP request.
 */
export async function GetComputers(options: ComputerSearchOptions, signal: AbortSignal | null = null): Promise<ComputerResult | null>
{
    try
    {
        const params: URLSearchParams = new URLSearchParams();
        params.set("query", options.query);
        params.set("sort", options.sort);
        params.set("limit", options.limit.toString());
        params.set("page", options.page.toString());
        params.set("ascending", options.ascending.toString());
        if (options.filter.type)
            params.set("type", options.filter.type.toString());
        if (options.filter.condition)
            params.set("condition", options.filter.condition.toString());
        if (options.filter.location)
            params.set("location", options.filter.location.toString());
        if (options.filter.operating_system)
            params.set("operating_system", options.filter.operating_system.toString());
        if (options.filter.make)
            params.set("make", options.filter.make.toString());
        if (options.filter.model)
            params.set("model", options.filter.model.toString());
        if (options.filter.primary_user)
            params.set("primary_user", options.filter.primary_user.toString());
        if (options.filter.available)
            params.set("available", options.filter.available.toString());
        console.log(`http://computers.local/api/?${params}`);

        const response = await fetch(`http://computers.local/api/?${params}`, {signal});
        const json: ComputerResult = await response.json();
        json.data = json.data.map((item: Computer) =>
        {
            item.type = GetComputerType(item.type as number);
            item.available = item.available === 1;
            item.condition = GetComputerCondition(item.condition as number);
            return item;
        });
        return json;
    } catch (e)
    {
        if (!signal?.aborted)
            console.error(e);

    }
    return null;
}

/**
 * Retrieves information about a computer from the API.
 *
 * @param {string} id - The ID of the computer to retrieve.
 * @return {Promise<Computer | null>} - A promise that resolves to the computer object if found, or null if not found.
 */
export async function GetComputer(id: string): Promise<Computer | null>
{
    try
    {
        const response = await fetch(`http://computers.local/api/${id}`);
        return await response.json();
    } catch (e)
    {
        console.error(e);
    }
    return null;
}

/**
 * Deletes a computer by its ID.
 *
 * @param {string} id - The ID of the computer to be deleted.
 *
 * @return {Promise<boolean>} A promise that resolves to true if the computer was successfully deleted,
 *                           or false if an error occurred or the response was not OK.
 */
export async function DeleteComputer(id: string): Promise<boolean>
{
    try
    {
        const response = await fetch(`http://computers.local/api/${id}`, {method: "DELETE"});
        return response.ok;
    } catch (e)
    {
        console.error(e);
    }
    return false;
}

/**
 * Updates the computer information with the provided data.
 *
 * @param {Computer} computer - The computer object to update.
 * @return {Promise<boolean>} - A promise that resolves to true if the computer was successfully updated,
 *                              or false if an error occurred or the response was not OK.
 */
export async function UpdateComputer(computer: Computer): Promise<boolean>
{
    if (computer.id === undefined || computer.id === null)
    {
        console.error("Computer ID is required to update a computer.");
        return false;
    }
    try
    {
        console.log(JSON.stringify(computer));
        const response = await fetch(`http://computers.local/api/${computer.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(computer)
        });
        return response.ok;
    } catch (e)
    {
        console.error(e);
    }
    return false;
}

/**
 * Adds a computer to the API.
 *
 * @param {Computer} computer - The computer object to be added.
 *
 * @return {Promise<Computer|null>} - A promise that resolves with the added computer object, or null if an error occurs.
 *
 * @throws {Error} - If there is an error while adding the computer.
 */
export async function AddComputer(computer: Computer): Promise<Computer | null>
{
    try
    {
        const response = await fetch(`http://computers.local/api/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(computer)
        });
        return await response.json();
    } catch (e)
    {
        console.error(e);
    }
    return null;
}