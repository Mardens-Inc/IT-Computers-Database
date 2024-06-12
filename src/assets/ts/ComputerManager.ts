export interface Computer {
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
    specs: any,
    notes: string,
    creation_date: Date,
    last_update: Date
}

export interface ComputerSpec {
    cpu: string | null,
    ram: string | null,
    storage: string | null,
    gpu: string | null,
    display: string | null,
    benchmark: string | null,
    ip_address: string | null,
    department: string | null,
    login: string | null,
    password: string | null,
    tv_id: string | null,
}


/**
 * Returns the computer type based on the given type code.
 * @param {number} type - The type code representing the computer type.
 * @return {string} - The computer type as a string.
 */
export function GetComputerType(type: number): string {
    switch (type) {
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

export interface ComputerSearchOptions {
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
export interface ComputerResult {
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

export async function GetComputers(options: ComputerSearchOptions, signal: AbortSignal | null = null): Promise<ComputerResult | null> {
    try {
        const response = await fetch(`http://computers.local/api/?query=${options.query}&sort=${options.sort}&limit=${options.limit}&page=${options.page}`, {signal})
        const json = await response.json();
        return json as ComputerResult;
    } catch (e) {
        if (!signal?.aborted)
            console.error(e)

    }
    return null;
}

export async function DeleteComputer(id:string){

}