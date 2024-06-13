export interface Computer
{
    id: string,
    asset_number: string,
    make: string,
    model: string,
    condition: number,
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

export interface ComputerSearchOptions
{
    query: string,
    sort: string,
    ascending: boolean,
    limit: number,
    page: number,
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
        const response = await fetch(`http://computers.local/api/?query=${options.query}&sort=${options.sort}&limit=${options.limit}&page=${options.page}`, {signal});
        const json = await response.json();
        return json as ComputerResult;
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
        const response = await fetch(`http://computers.local/api/${computer.id}`, {
            method: "PATCH",
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