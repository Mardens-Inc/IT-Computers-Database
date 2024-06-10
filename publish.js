import {Client} from 'basic-ftp'
import {readFileSync, writeFileSync, readdirSync} from 'fs'

console.log("Uploading files")
const client = new Client()
client.ftp.verbose = true
try {
    await client.access({
        host: "panel.mardens.com",
        user: "ftp_computers_mardens_com",
        password: "ya5zMTzehxHN4AMW"
    })

    const jsFiles = readdirSync("dist", {recursive: true}).filter(i => i.endsWith(".js"))

    for (const file of jsFiles) {
        const path = `dist/${file}`
        const data = readFileSync(path, "utf8")
        const newData = data.replace(/http:\/\/computers.local\//g, "/")
        writeFileSync(path, newData, "utf8")
    }


    // delete all files in the assets folder
    try {
        await client.removeDir("assets")
    } catch (err) {
        console.error(err)
    }
    try {
        await client.removeDir("api")
    } catch (err) {
        console.error(err)
    }
    try {
        await client.remove("index.html")
    } catch (err) {
        console.error(err)
    }

    await client.uploadFromDir("dist", "/")
    await client.uploadFromDir("api", "/api")
} catch (err) {
    console.log(err)
}
client.close()