window.onload = () => {
    loadData(); 
};

async function sendData() {

    const speed = document.getElementById('speedInput').value;
    const temp = document.getElementById('tempInput').value;
    const loc = document.getElementById('locationInput').value;

      //filled forms check
      if (speed === "" || temp === "" || loc === "") {
        alert("Please fill out all fields before saving!");
        return;
    }

    // grab data from html input

    const formData = new FormData ();
    formData.append('speed', speed);
    formData.append('temp', temp);
    formData.append('loc', loc);

    // send to php
    const response = await fetch('save_data.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    if(result.status === "success") {
        alert("Data saved!");

        // clear the form after saving
        document.getElementById('speedInput').value = "";
        document.getElementById('tempInput').value = "";
        document.getElementById('locationInput').value = "";

        loadData(); // Refresh the display
    } 
}

//display data from database
async function loadData() {
    const display = document.getElementById('data-display');
    try{
        const response = await fetch('get_data.php');

        if (!response.ok) {
            throw new Error("Could not reach the server");
        }

    const data = await response.json();

    display.innerHTML = ''; // Clear previous data

    data.forEach(row => {
        display.innerHTML += `
            <tr>
                <td>${row.id}</td>
                <td>${row.speed}</td>
                <td>${row.temp}</td>
                <td>${row.loc}</td>
                <td>${row.rec}</td>
            </tr>`;
    });

    } catch (error) {
        console.error("Error loading data:", error);
        display.innerHTML = `<tr><td colspan='5' style='color:red; text-align:center;'>
            Failed to load data. Please check your database connection.
        </td></tr>`;
    } 
}