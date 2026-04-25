const form = document.querySelector(".header__form");
const list = document.querySelector(".todo__list");

form.addEventListener("submit", addItem);

function getStorageTodos() {
  let storage = localStorage.getItem("todos");
  if (storage === null) {
    return [];
  }
  return JSON.parse(storage);
}
function getStorageCheckedTodos() {
  let storage = localStorage.getItem("checkedTodos");
  if (storage === null) {
    return [];
  }
  return JSON.parse(storage);
}

function saveTodos(todos) {
  let jsonStorage = JSON.stringify(todos);
  localStorage.setItem("todos", jsonStorage);
}
function saveCheckedTodos(todos) {
  let jsonStorage = JSON.stringify(todos);
  localStorage.setItem("checkedTodos", jsonStorage);
}

function loadTodos() {
  let todos = getStorageTodos();
  for (const todo of todos) {
    list.append(createTodoElement(todo));
  }

  let checkedTodos = getStorageCheckedTodos();
  for (const checkedTodo of checkedTodos) {
    let item = createTodoElement(checkedTodo);
    list.append(item);
    let checkbox = item.querySelector(".checkbox__real");
    if (checkbox) {
      checkbox.checked = true;
    }

    item.classList.add("checked-item");
  }
}

loadTodos();

function createTodoElement(text) {
  let item = document.createElement("li");
  item.className = "todo__list-item";

  let textSpan = document.createElement("span");
  textSpan.className = "todo__list-text";
  textSpan.appendChild(document.createTextNode(text));
  item.appendChild(textSpan);

  let actionsWrapper = document.createElement("div");
  actionsWrapper.className = "todo-item__actions";
  item.appendChild(actionsWrapper);

  let checkbox = document.createElement("label");
  checkbox.className = "todo-item__checkbox checkbox";
  actionsWrapper.appendChild(checkbox);

  let checkboxReal = document.createElement("input");
  checkboxReal.className = "checkbox__real";
  checkboxReal.type = "checkbox";
  checkbox.appendChild(checkboxReal);

  let checkboxCustom = document.createElement("span");
  checkboxCustom.className = "checkbox__custom";
  checkbox.appendChild(checkboxCustom);

  let deleteButton = document.createElement("button");
  deleteButton.className = "todo-item__button";
  deleteButton.dataset.action = "delete";
  actionsWrapper.appendChild(deleteButton);

  return item;
}

function addItem(event) {
  event.preventDefault();
  let formInput = document.querySelector(".header-form__input");
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
    let listItem = event.target.closest("li");

    let taskText = listItem.querySelector(".todo__list-text").textContent;

    listItem.classList.add("todo__list-item--removing");

    listItem.addEventListener("animationend", function () {
      listItem.remove();

      let todos = getStorageTodos();
      let checkedTodos = getStorageCheckedTodos();

      let indexInTodos = todos.indexOf(taskText);
      let indexInChecked = checkedTodos.indexOf(taskText);

      if (indexInTodos !== -1) {
        todos.splice(indexInTodos, 1);
        saveTodos(todos);
      } else if (indexInChecked !== -1) {
        checkedTodos.splice(indexInChecked, 1);
        saveCheckedTodos(checkedTodos);
      }
    });
  }
}

list.addEventListener("change", checkedItem);

function checkedItem(event) {
  if (event.target.classList.contains("checkbox__real")) {
    let listItem = event.target.closest("li");

    let taskText = listItem.querySelector(".todo__list-text").textContent;

    listItem.classList.toggle("checked-item");

    let todos = getStorageTodos();
    let checkedTodos = getStorageCheckedTodos();

    if (event.target.checked) {
      let index = todos.indexOf(taskText);

      let positionYOld = listItem.getBoundingClientRect().top;
      list.append(listItem);
      let positionYNew = listItem.getBoundingClientRect().top;

      let differenceY = positionYOld - positionYNew;
      if (differenceY !== 0) {
        listItem.style.transform = `translateY(${differenceY}px)`;
        listItem.style.transition = "none";

        requestAnimationFrame(() => {
          setTimeout(() => {
            listItem.style.transition =
              "transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)";
            listItem.style.transform = "translateY(0)";
          }, 10);
        });

        listItem.addEventListener(
          "transitionend",
          function onEnd() {
            listItem.style.transform = "";
            listItem.style.transition = "";
          },
          { once: true },
        );
      }

      if (index !== -1) {
        todos.splice(index, 1);
        saveTodos(todos);
      }

      checkedTodos.push(taskText);
      saveCheckedTodos(checkedTodos);
    } else {
      let index = checkedTodos.indexOf(taskText);

      let positionYOld = listItem.getBoundingClientRect().top;
      list.prepend(listItem);
      let positionYNew = listItem.getBoundingClientRect().top;
      let differenceY = positionYOld - positionYNew;
      if (differenceY !== 0) {
        listItem.style.transform = `translateY(${differenceY}px)`;
        listItem.style.transition = "none";

        requestAnimationFrame(() => {
          setTimeout(() => {
            listItem.style.transition = "transform 0.5s ease";
            listItem.style.transform = "translateY(0)";
          }, 10);
        });
        listItem.addEventListener(
          "transitionend",
          function onEnd() {
            listItem.style.transform = "";
            listItem.style.transition = "";
          },
          { once: true },
        );
      }

      if (index !== -1) {
        checkedTodos.splice(index, 1);
        saveCheckedTodos(checkedTodos);
      }

      todos.push(taskText);
      saveTodos(todos);
    }
  }
}
