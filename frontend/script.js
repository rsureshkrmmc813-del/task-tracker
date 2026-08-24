// ============================================================
// TASK TRACKER - FRONTEND JAVASCRIPT
// ============================================================


// ============================================================
// 1. BACKEND API URL
// ============================================================

// Our Express backend is running on port 3000.
//
// The frontend will send HTTP requests to this address.
const API_URL = "http://localhost:3000/api/tasks";


// ============================================================
// 2. GET HTML ELEMENTS
// ============================================================

// Find elements from index.html using their IDs.

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const taskList = document.getElementById("taskList");


// ============================================================
// 3. LOAD TASKS WHEN PAGE OPENS
// ============================================================

// This function will run when the browser loads the page.
//
// async means the function can use await.

async function loadTasks() {

    try {

        // Send a GET request to the backend.
        const response = await fetch(API_URL);

        // Convert the JSON response into a JavaScript value.
        const tasks = await response.json();

        // Display the tasks on the page.
        displayTasks(tasks);

    } catch (error) {

        // If the backend cannot be reached, this runs.
        console.error("Failed to load tasks:", error);

        taskList.innerHTML =
            "<li>Could not connect to the server.</li>";
    }
}


// ============================================================
// 4. DISPLAY TASKS
// ============================================================

// This function receives an array of tasks.
//
// Then it creates HTML elements dynamically.

function displayTasks(tasks) {

    // Clear the existing list first.
    taskList.innerHTML = "";

    // Loop through every task.
    tasks.forEach(task => {

        // Create a new <li> element.
        const listItem = document.createElement("li");

        // Add CSS class.
        listItem.classList.add("task-item");

        // If the task is completed, add another class.
        if (task.completed) {
            listItem.classList.add("completed");
        }

        // Create the task title.
        const title = document.createElement("span");

        title.classList.add("task-title");

        title.textContent = task.title;


        // ====================================================
        // CHECKBOX
        // ====================================================

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = task.completed;


        // When checkbox changes, update the backend.
        checkbox.addEventListener("change", () => {

            updateTask(task.id, checkbox.checked);

        });


        // ====================================================
        // DELETE BUTTON
        // ====================================================

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.classList.add("delete-button");


        // When the button is clicked, delete the task.
        deleteButton.addEventListener("click", () => {

            deleteTask(task.id);

        });


        // Add everything to the list item.
        listItem.appendChild(checkbox);

        listItem.appendChild(title);

        listItem.appendChild(deleteButton);


        // Add the list item to the page.
        taskList.appendChild(listItem);
    });
}


// ============================================================
// 5. ADD NEW TASK
// ============================================================

// Listen for form submission.

taskForm.addEventListener("submit", async (event) => {

    // Prevent the browser from refreshing the page.
    event.preventDefault();

    // Get the user's input.
    const title = taskInput.value.trim();

    // Don't send an empty task.
    if (!title) {
        return;
    }

    try {

        // Send POST request to backend.
        const response = await fetch(API_URL, {

            // Tell the server this is a POST request.
            method: "POST",

            // Tell the server that we're sending JSON.
            headers: {
                "Content-Type": "application/json"
            },

            // Convert JavaScript object into JSON.
            body: JSON.stringify({
                title: title
            })
        });


        // Check whether the server returned an error.
        if (!response.ok) {

            throw new Error("Failed to create task");

        }


        // Clear input after successful request.
        taskInput.value = "";


        // Reload tasks from the backend.
        loadTasks();

    } catch (error) {

        console.error("Error adding task:", error);

    }
});


// ============================================================
// 6. UPDATE TASK
// ============================================================

async function updateTask(taskId, completed) {

    try {

        const response = await fetch(`${API_URL}/${taskId}`, {

            // PUT means we are updating existing data.
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                completed: completed
            })
        });


        if (!response.ok) {
            throw new Error("Failed to update task");
        }


        // Reload the task list.
        loadTasks();

    } catch (error) {

        console.error("Error updating task:", error);

    }
}


// ============================================================
// 7. DELETE TASK
// ============================================================

async function deleteTask(taskId) {

    try {

        const response = await fetch(`${API_URL}/${taskId}`, {

            method: "DELETE"

        });


        if (!response.ok) {
            throw new Error("Failed to delete task");
        }


        // Reload tasks after deletion.
        loadTasks();

    } catch (error) {

        console.error("Error deleting task:", error);

    }
}


// ============================================================
// 8. START APPLICATION
// ============================================================

// Load existing tasks when JavaScript starts.

loadTasks();