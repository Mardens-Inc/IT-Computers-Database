import Filemaker from "./Filemaker.js";
// eslint-disable-next-line no-undef
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const filemaker = new Filemaker("https://lib.mardens.com/fmutil", "admin", "19MRCC77!", "IT Master Computer database", "IT Master Computer database");
const count = await filemaker.getRecordCount();
const records = await filemaker.getRecords(count)

const items = [];


for (const record of records) {
    let blankFields = 0
    for (const field of Object.keys(record.fields)) {
        if (record.getField(field).replace(/[^0-9A-Za-z]/g, "") === "") {
            blankFields++;
        }
    }

    if (blankFields >= record.fields.length - 1) {
        console.log("Skipping record with all blank fields");
        continue;
    }

    let condition = record.getField("Condition").toLowerCase();
    let deviceType = record.getField("Device Type").toLowerCase();
    let available = 0;

    if (condition.includes("broken"))
        condition = 1;
    else if (condition.includes("ok") || condition.includes("good") || condition.includes("worn") || condition.includes("old") || condition.includes("used"))
        condition = 2;
    else if (condition.includes("refurb") || condition.includes("open"))
        condition = 3;
    else if (condition.includes("display"))
        condition = 4;
    else if (condition.includes("new"))
        condition = 5;
    else
        condition = 0;

    if (deviceType.includes("available"))
        available = 1;

    if (deviceType.includes("laptop") || deviceType.includes("chrome"))
        deviceType = 1;
    else if (deviceType.includes("desk") || deviceType.includes("pc"))
        deviceType = 2;
    else if (deviceType.includes("printer"))
        deviceType = 3;
    else if (deviceType.includes("copier"))
        deviceType = 4;
    else if (deviceType.includes("phone") || deviceType.includes("ohone"))
        deviceType = 5;
    else if (deviceType.includes("umix"))
        deviceType = 5;
    else if (deviceType.includes("kiosk"))
        deviceType = 6;
    else if (deviceType.includes("tablet"))
        deviceType = 7;
    else
        deviceType = 0;


    let specs = ["CPU Model", "CPU Benchmark", "IP Address", "In Service Date", "Retired Date", "Login", "Password", "Disk", "RAM", "Department", "TV ID"]
        .reduce((obj, field) => {
            let value = record.getField(field).toLowerCase().trim();
            if (value.replace(/[^0-9A-Za-z]/g, "") !== "") {
                obj[field.toLowerCase().replace(/ /g, "_")] = value;
            }
            return obj;
        }, {});

    const item = {
        "asset_number": record.getField("Asset number").replace(/[^0-9A-Za-z\s]/g, "").replace(/[\r\n]/g,"").trim(),
        "make": record.getField("Make").toLowerCase().replace(/[^0-9A-Za-z\s]/g, "").replace(/[\r\n]/g,"").trim(),
        "model": record.getField("Model No.").toLowerCase().replace(/[^0-9A-Za-z\s]/g, "").replace(/[\r\n]/g,"").trim(),
        "location": record.getField("Location").toLowerCase().replace(/[^0-9A-Za-z\s]/g, "").replace(/[\r\n]/g,"").trim(),
        "primary_user": record.getField("Primary User").toLowerCase().replace(/[^0-9A-Za-z\s]/g, "").replace(/[\r\n]/g,"").trim(),
        "operating_system": record.getField("OS").toLowerCase().replace(/[^0-9A-Za-z\s]/g, "").replace(/[\r\n]/g,"").trim(),
        "condition": condition,
        "type": deviceType,
        "available": available,
        "specs": specs,
        "notes": record.getField("Notes").trim()
    }
    items.push(item);
}

await fetch("http://computers.local/api/", {method: "POST", body: JSON.stringify(items), headers: {"Content-Type": "application/json"}})
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);