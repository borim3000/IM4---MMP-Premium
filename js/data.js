window.onload = () => {
    loadData(); 
};

async function sendData() {
    const wert = document.getElementById('wertInput').value;
    
    if (wert === "") {
        alert("Please fill out all fields before saving!");
        return;
    }

    const formData = new FormData();
    formData.append('wert', wert);

    try {
        const response = await fetch('api/save_data.php', {
            method: 'POST',
            body: formData
        });

        // --- NEW: Grab the raw text from PHP before trying to parse it ---
        const rawText = await response.text(); 
        
        try {
            // Try to parse it into JSON
            const result = JSON.parse(rawText); 
            
            if(result.status === "success") {
                alert("Data saved!");
                document.getElementById('wertInput').value = "";
                loadData(); 
            } else {
                alert("Database Error: " + result.message);
            }
            
        } catch (parseError) {
            // If it's not JSON, PHP crashed. Let's show the PHP error!
            console.error("Raw PHP Output:", rawText);
            alert("PHP CRASHED! Here is the error message from the server:\n\n" + rawText);
        }

    } catch (networkError) {
        console.error("Fetch failed:", networkError);
    }
}

//display data from database
async function loadData() {
    const display = document.getElementById('data-display');
    try{
        const response = await fetch('api/get_data.php');

        if (!response.ok) {
            throw new Error("Could not reach the server");
        }

    const data = await response.json();

    display.innerHTML = ''; // Clear previous data

    data.forEach((row, index) => {
        display.innerHTML += `
            <tr>
                <td>${data.length - index}</td>
                <td>${row.wert}</td>
                <td>${row.zeit}</td>
                <td><button class="delete-btn" onclick="deleteData(${row.ID})">Delete</button></td>
            </tr>`;
    });

    } catch (error) {
        console.error("Error loading data:", error);
        display.innerHTML = `<tr><td colspan='5' style='color:red; text-align:center;'>
            Failed to load data. Please check your database connection.
        </td></tr>`;
    } 
}

// function to delete datasets by line
async function deleteData(id) {
    // Ask the user for confirmation so they don't accidentally delete data
    if (!confirm("Are you sure you want to delete this entry?")) {
        return; 
    }

    const formData = new FormData();
    formData.append('ID', id);

    try {
        const response = await fetch('api/delete_data.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.status === "success") {
            alert("Entry deleted successfully!");
            loadData(); // Instantly refresh the table view
        } else {
            alert("Error deleting entry: " + result.message);
        }
    } catch (error) {
        console.error("Error connecting to server:", error);
    }
} 
