import $ from "jquery";

interface UniqueFields
{
    make: string[];
    model: string[];
    location: string[];
    primary_user: string[];
    operating_system: string[];
}

export const uniqueFields: UniqueFields = {
    "make": JSON.parse(window.localStorage.getItem("make") ?? "[]") || [],
    "model": JSON.parse(window.localStorage.getItem("model") ?? "[]") || [],
    "location": JSON.parse(window.localStorage.getItem("location") ?? "[]") || [],
    "primary_user": JSON.parse(window.localStorage.getItem("primary_user") ?? "[]") || [],
    "operating_system": JSON.parse(window.localStorage.getItem("operating_system") ?? "[]") || []
};

$(document).ready(async () =>
{
    const requests = [
        $.get("http://computers.local/api/unique/make"),
        $.get("http://computers.local/api/unique/model"),
        $.get("http://computers.local/api/unique/location"),
        $.get("http://computers.local/api/unique/primary_user"),
        $.get("http://computers.local/api/unique/operating_system")
    ];

    const [make, model, location, primary_user, operating_system] = await Promise.all(requests);
    window.localStorage.setItem("make", JSON.stringify(uniqueFields.make = Object.values(make)));
    window.localStorage.setItem("model", JSON.stringify(uniqueFields.model = Object.values(model)));
    window.localStorage.setItem("location", JSON.stringify(uniqueFields.location = Object.values(location)));
    window.localStorage.setItem("primary_user", JSON.stringify(uniqueFields.primary_user = Object.values(primary_user)));
    window.localStorage.setItem("operating_system", JSON.stringify(uniqueFields.operating_system = Object.values(operating_system)));
});
