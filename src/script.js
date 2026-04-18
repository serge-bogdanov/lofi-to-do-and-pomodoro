const form = document.querySelector(".todo-form");
const list = document.querySelector(".todo__list");

form.addEventListener("submit", addItem);

function getStorageTodos() {
  let storage = localStorage.getItem("todos");
  if (storage === null) {
    return [];
  }
  return JSON.parse(storage);
}

function saveTodos(todos) {
  let jsonStorage = JSON.stringify(todos);
  localStorage.setItem("todos", jsonStorage);
}

function loadTodos() {
  let todos = getStorageTodos();
  for (const todo of todos) {
    list.append(createTodoElement(todo))
  }
}
loadTodos()

function createTodoElement(text) {
  let item = document.createElement("li");
  item.className = "todo__list-item";

  let textNode = document.createTextNode(text);
  item.appendChild(textNode);

  let deleteButton = document.createElement("button");
  deleteButton.appendChild(document.createTextNode("X"));
  deleteButton.className = "todo-item__button";
  deleteButton.dataset.action = "delete";
  item.appendChild(deleteButton)

  return item;
}


function addItem(event) {
  event.preventDefault();
  let formInput = document.querySelector(".todo-form__input");
  let inputText = formInput.value;

  if (inputText !== "") {
    list.prepend(createTodoElement(inputText));
    
    let todos = getStorageTodos();
    todos.push(inputText);
    saveTodos(todos);

    formInput.value = "";
  }
}

list.addEventListener("click", deleteItem);

function deleteItem(event) {
  if (
    event.target.hasAttribute("data-action") &&
    event.target.getAttribute("data-action") === "delete"
  ) {
    let listItem = event.target.closest("li")

    let taskText = listItem.firstChild.textContent

    listItem.remove()

    let todos = getStorageTodos()
    let index = todos.indexOf(taskText)

    if (index !== -1) {и
      todos.splice(index, 1)
      saveTodos(todos)
    }

  }

}
