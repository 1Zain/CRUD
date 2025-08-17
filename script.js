// ===== SIMPLE CRUD LEARNING SCRIPT =====
// This script teaches the basic CRUD operations step by step

// Step 1: Define our API URL (where we get and send data)
const API_URL = "https://68a04cea6e38a02c58184c4b.mockapi.io/users/users";

// Step 2: Get the HTML elements we need
const tableBody = document.querySelector("#usersTable tbody");
const addBtn = document.getElementById("addBtn");
const nameInput = document.getElementById("nameInput");
const avatarInput = document.getElementById("avatarInput");

// ===== CRUD OPERATION 1: GET (Read) =====
// This function gets all users from the API
async function getUsers() {
    console.log("Getting users from API...");
    
    // Step 1: Ask the API for data
    const response = await fetch(API_URL);
    
    // Step 2: Convert the response to JavaScript objects
    const users = await response.json();
    
    console.log("Users received:", users);
    
    // Step 3: Show the users in the table
    showUsersInTable(users);
}

// Function to display users in the table
function showUsersInTable(users) {
    console.log("Showing users in table...");
    
    // Clear the table first
    tableBody.innerHTML = "";
    
    // For each user, create a table row
    users.forEach(user => {
        // Create a new table row
        const row = document.createElement("tr");
        
        // Fill the row with user data
        row.innerHTML = `
            <td>${user.id}</td>
            <td><img src="${user.avatar}" alt="avatar" style="width: 50px; height: 50px;"></td>
            <td>${user.name}</td>
            <td>${new Date(user.createdAt).toLocaleString()}</td>
            <td>
                <button onclick="editUser('${user.id}', '${user.name}', '${user.avatar}')">Edit</button>
                <button onclick="deleteUser('${user.id}')">Delete</button>
            </td>
        `;
        
        // Add the row to the table
        tableBody.appendChild(row);
    });
}

// ===== CRUD OPERATION 2: POST (Create) =====
// This function creates a new user
async function createUser() {
    console.log("Creating new user...");
    
    // Step 1: Get the data from the input fields
    const name = nameInput.value.trim();
    const avatar = avatarInput.value.trim();
    
    // Step 2: Check if the fields are filled
    if (!name || !avatar) {
        alert("Please fill in both name and avatar fields!");
        return;
    }
    
    console.log("Sending data:", { name, avatar });
    
    // Step 3: Send the data to the API
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
            name: name, 
            avatar: avatar 
        })
    });
    
    console.log("User created successfully!");
    
    // Step 4: Clear the input fields
    nameInput.value = "";
    avatarInput.value = "";
    
    // Step 5: Refresh the table to show the new user
    getUsers();
}

// ===== CRUD OPERATION 3: PUT (Update) =====
// This function updates an existing user
async function updateUser(userId, newName, newAvatar) {
    console.log("Updating user:", userId);
    console.log("New data:", { name: newName, avatar: newAvatar });
    
    // Step 1: Send the updated data to the API
    const response = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
            name: newName, 
            avatar: newAvatar 
        })
    });
    
    console.log("User updated successfully!");
    
    // Step 2: Refresh the table to show the changes
    getUsers();
}

// ===== CRUD OPERATION 4: DELETE =====
// This function deletes a user
async function deleteUser(userId) {
    console.log("Deleting user:", userId);
    
    // Step 1: Ask user for confirmation
    if (!confirm("Are you sure you want to delete this user?")) {
        console.log("Delete cancelled by user");
        return;
    }
    
    // Step 2: Send delete request to API
    const response = await fetch(`${API_URL}/${userId}`, { 
        method: "DELETE" 
    });
    
    console.log("User deleted successfully!");
    
    // Step 3: Refresh the table to show the changes
    getUsers();
}

// ===== HELPER FUNCTIONS =====

// Function to edit a user (shows input fields in the table)
function editUser(userId, currentName, currentAvatar) {
    console.log("Editing user:", userId);
    
    // Find the table row for this user
    const rows = tableBody.querySelectorAll("tr");
    let targetRow = null;
    
    for (let row of rows) {
        if (row.cells[0].textContent === userId) {
            targetRow = row;
            break;
        }
    }
    
    if (!targetRow) {
        console.log("User row not found");
        return;
    }
    
    // Replace the name and avatar cells with input fields
    targetRow.cells[2].innerHTML = `<input type="text" value="${currentName}" id="editName-${userId}">`;
    targetRow.cells[1].innerHTML = `<input type="text" value="${currentAvatar}" id="editAvatar-${userId}">`;
    
    // Replace the action buttons with Save and Cancel
    targetRow.cells[4].innerHTML = `
        <button onclick="saveUser('${userId}')">Save</button>
        <button onclick="getUsers()">Cancel</button>
    `;
}

// Function to save the edited user
function saveUser(userId) {
    console.log("Saving user:", userId);
    
    // Get the new values from the input fields
    const newName = document.getElementById(`editName-${userId}`).value;
    const newAvatar = document.getElementById(`editAvatar-${userId}`).value;
    
    // Check if fields are filled
    if (!newName || !newAvatar) {
        alert("Please fill in both name and avatar fields!");
        return;
    }
    
    // Call the update function
    updateUser(userId, newName, newAvatar);
}

// ===== SETUP =====

// When the page loads, set up the event listeners
document.addEventListener("DOMContentLoaded", function() {
    console.log("Page loaded! Setting up CRUD app...");
    
    // Connect the Add button to the createUser function
    addBtn.addEventListener("click", createUser);
    
    // Load users when the page starts
    getUsers();
});


