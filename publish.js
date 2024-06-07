import {Client} from 'basic-ftp'

console.log("Uploading files")
const client = new Client()
client.ftp.verbose = true
try {
    await client.access({
        host: "panel.mardens.com",
        user: "ftp_computers_mardens_com",
        password: "ya5zMTzehxHN4AMW"
    })

    // delete all files in the assets folder
    await client.removeDir("assets")
    await client.removeDir("api")
    await client.remove("index.html")

    await client.uploadFromDir("dist", "/")
    await client.uploadFromDir("api", "/api")
} catch (err) {
    console.log(err)
}
client.close()