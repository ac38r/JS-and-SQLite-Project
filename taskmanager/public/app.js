const API_BASE_URL = 'http://localhost:3000/api'; // Adjusted path for API endpoints

// DOM Elements
const authSection = document.getElementById('auth-section');
const taskSection = document.getElementById('task-section');
const loginForm = document.getElementById('login-form');
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const showRegister = document.getElementById('show-register');
const logoutButton = document.getElementById('logout');

let token = null;

// Show/hide sections
function toggleSection(isAuthenticated){
    authSection.style.display = isAuthenticated ? 'none' : 'block';
    taskSection.style.display = isAuthenticated ? 'block' : 'none';
}

// Fetch tasks
async function fetchTasks() {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        headers: { Authorization: token },
    });
    const tasks = await response.json();
    renderTasks(tasks);
}

// Render Task
function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach((task) => {
        const div = document.createElement('div');
        div.classList.add('task');
        div.innerHTML = `
            <strong>${task.title}</strong>
            <p>${task.description || 'No description'}</p>
            <small>Due: ${task.due_date}</small>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(div);
    });
}

// Add Task
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const due_date = document.getElementById('due_date').value;

    await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify({ title, description, due_date }),
    });
    fetchTasks();
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

});