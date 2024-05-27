const inputBox = document.getElementById('inputBox');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

let editTodo = null;

const addTodo = () => {
    const inputText = inputBox.value.trim();
    if (!inputText) {
        alert("You must write something in your to do");
        return false;
    }

    if (addBtn.value === "Edit") {
        editLocalTodos(editTodo.target.previousElementSibling.innerHTML);
        editTodo.target.previousElementSibling.innerHTML = inputText;
        addBtn.value = "Add";
        inputBox.value = "";
    } else {
        const li = createTodoItem(inputText);
        todoList.appendChild(li);
        inputBox.value = "";
        saveLocalTodos(inputText);
    }
};

const updateTodo = (e) => {
    if (e.target.innerHTML === "Remove") {
        todoList.removeChild(e.target.parentElement);
        deleteLocalTodos(e.target.parentElement);
    } else if (e.target.innerHTML === "Edit") {
        inputBox.value = e.target.previousElementSibling.innerHTML;
        inputBox.focus();
        addBtn.value = "Edit";
        editTodo = e;
    }
};

const saveLocalTodos = (todo) => {
    let todos = getTodosFromLocalStorage();
    todos.push(todo);
    saveTodosToLocalStorage(todos);
};

const getLocalTodos = () => {
    const todos = getTodosFromLocalStorage();
    todos.forEach(todo => {
        const li = createTodoItem(todo);
        todoList.appendChild(li);
    });
};

const deleteLocalTodos = (todo) => {
    let todos = getTodosFromLocalStorage();
    const todoText = todo.children[0].innerHTML;
    const todoIndex = todos.indexOf(todoText);
    todos.splice(todoIndex, 1);
    saveTodosToLocalStorage(todos);
};

const editLocalTodos = (todo) => {
    let todos = getTodosFromLocalStorage();
    const todoIndex = todos.indexOf(todo);
    todos[todoIndex] = inputBox.value;
    saveTodosToLocalStorage(todos);
};

const getTodosFromLocalStorage = () => {
    try {
        return JSON.parse(localStorage.getItem("todos")) || [];
    } catch (e) {
        console.error("Error reading from localStorage", e);
        return [];
    }
};

const saveTodosToLocalStorage = (todos) => {
    try {
        localStorage.setItem("todos", JSON.stringify(todos));
    } catch (e) {
        console.error("Error saving to localStorage", e);
    }
};

const createTodoItem = (text) => {
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.innerHTML = text;
    li.appendChild(p);

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("btn", "editBtn");
    editBtn.setAttribute('aria-label', 'Edit To Do');
    li.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Remove";
    deleteBtn.classList.add("btn", "deleteBtn");
    deleteBtn.setAttribute('aria-label', 'Remove To Do');
    li.appendChild(deleteBtn);

    return li;
};

document.addEventListener('DOMContentLoaded', getLocalTodos);
addBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', updateTodo);
inputBox.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});
