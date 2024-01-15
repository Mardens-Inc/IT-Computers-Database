<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IT Computers Database - Mardens Apps</title>
    <link rel="stylesheet" href="/assets/css/main.min.css?version=1">
    <link rel="stylesheet" href="/assets/css/table.min.css?version=1">
    <link rel="icon" href="https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_32,h_32/https://www.mardens.com/wp-content/uploads/2019/03/cropped-Mardens-Favicon-1-32x32.png" sizes="32x32">
    <link rel="icon" href="https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_192,h_192/https://www.mardens.com/wp-content/uploads/2019/03/cropped-Mardens-Favicon-1-192x192.png" sizes="192x192">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="/assets/lib/fontawesome/css/all.min.css">

    <!-- jQuery -->
    <script src="/assets/lib/jquery.min.js"></script>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>

<body>
    <h1><span class="blue">&lt;</span>IT<span class="blue">&gt;</span> <span class="yellow">Computers</pan>
    </h1>
    <h2>
        Created for Mardens Surplus & Salvage.
    </h2>
    <form action="javascript:void(0);" class="search-area">
        <input type="search" name="search" id="search" required>
        <button type="submit" name="submit" id="submit"><i class="fas fa-search"></i></button>
    </form>
    <table>
        <thead>
            <tr>
                <td>Asset Number</td>
                <td>Make</td>
                <td>Model</td>
                <td>Condition</td>
                <td>Device Type</td>
                <td>Operating System</td>
                <td>Primary User</td>
                <td>Location</td>
                <td>Additional Information</td>
                <td>Notes</td>
            </tr>
        </thead>
        <tbody>
            <?php

            for ($i = 0; $i < 10; $i++) {
                echo "
                <tr>
                    <td>123456</td>
                    <td>Apple</td>
                    <td>Macbook Pro</td>
                    <td>Good</td>
                    <td>Laptop</td>
                    <td>MacOS</td>
                    <td>John Doe</td>
                    <td>Portland</td>
                    <td>None</td>
                    <td>None</td>
                </tr>";
            }

            ?>
        </tbody>
    </table>
</body>

</html>