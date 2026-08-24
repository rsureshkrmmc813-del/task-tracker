const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

let tasks = [
    {
        id: 1,
        title: "learn HTML",
        completed: true
    },
    {
        id: 2,
        title: "learn JavaScript fetch()",
        completed: false
    }
    
];


let nextId = 3;

app.get("/",(req, res) =>{
    res.send("Task Tracker API is running");
});


app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});


app.post("/api/tasks", (req, res) => {

    const { title } = req.body;

    if(!title || title.trim() === ""){
        return res.status(400).json({
             message: "Title is required"
             });

    }

    const newTask = {
        id: nextId++,
        title: title.trim(),
        completed: false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);  

});


app.delete("/api/tasks/:id", (req, res) => {

    // URL parameters arrive as strings.
    // Convert the ID to a number.
    const taskId = Number(req.params.id);

    // Find the task.
    const taskExists = tasks.some(task => task.id === taskId);

    if (!taskExists) {
        return res.status(404).json({
            message: "Task not found."
        });
    }

    // Remove the task from the array.
    tasks = tasks.filter(task => task.id !== taskId);

    res.json({
        message: "Task deleted successfully."
    });
});



app.put("/api/tasks/:id", (req, res) => {

    const taskId = Number(req.params.id);

    // Find the task.
    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return res.status(404).json({
            message: "Task not found."
        });
    }

    // Update the completed value.
    task.completed = Boolean(req.body.completed);

    res.json(task);
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
