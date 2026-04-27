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
    resetFilters();
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

    const allItems = [...list.querySelectorAll(".todo__list-item")];
    const oldPositions = allItems.map(
      (item) => item.getBoundingClientRect().top,
    );

    listItem.classList.add("todo__list-item--removing");

    listItem.addEventListener("animationend", function () {
      listItem.remove();

      const remainingItems = [...list.querySelectorAll(".todo__list-item")];

      remainingItems.forEach((item) => {
        const oldIndex = allItems.indexOf(item);
        if (oldIndex !== -1) {
          const newY = item.getBoundingClientRect().top;
          const diffY = oldPositions[oldIndex] - newY;

          if (diffY !== 0) {
            item.style.transform = `translateY(${diffY}px)`;
            item.style.transition = "none";
            item.offsetHeight;
            item.style.transition = "transform 0.5s ease";
            item.style.transform = "translateY(0)";
          }
        }
      });

      if (remainingItems.length > 0) {
        remainingItems[0].addEventListener(
          "transitionend",
          function clean() {
            remainingItems.forEach((item) => {
              item.style.transform = "";
              item.style.transition = "";
            });
            remainingItems[0].removeEventListener("transitionend", clean);
          },
          { once: true },
        );
      }

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

      const allItems = [...list.querySelectorAll(".todo__list-item")];
      const oldPositions = allItems.map(
        (item) => item.getBoundingClientRect().top,
      );

      list.append(listItem);

      allItems.forEach((item, i) => {
        const newY = item.getBoundingClientRect().top;
        const diffY = oldPositions[i] - newY;

        if (diffY !== 0) {
          item.style.transform = `translateY(${diffY}px)`;
          item.style.transition = "none";
          item.offsetHeight;
          item.style.transition = "transform 0.5s ease";
          item.style.transform = "translateY(0)";
        }
      });

      const firstMoved = allItems.find(
        (item, i) => oldPositions[i] - item.getBoundingClientRect().top !== 0,
      );
      if (firstMoved) {
        firstMoved.addEventListener(
          "transitionend",
          function clean() {
            allItems.forEach((item) => {
              item.style.transform = "";
              item.style.transition = "";
            });
            firstMoved.removeEventListener("transitionend", clean);
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

      const allItems = [...list.querySelectorAll(".todo__list-item")];
      const oldPositions = allItems.map(
        (item) => item.getBoundingClientRect().top,
      );

      list.prepend(listItem);

      allItems.forEach((item, i) => {
        const newY = item.getBoundingClientRect().top;
        const diffY = oldPositions[i] - newY;

        if (diffY !== 0) {
          item.style.transform = `translateY(${diffY}px)`;
          item.style.transition = "none";
          item.offsetHeight;
          item.style.transition = "transform 0.5s ease";
          item.style.transform = "translateY(0)";
        }
      });

      const firstMoved = allItems.find(
        (item, i) => oldPositions[i] - item.getBoundingClientRect().top !== 0,
      );
      if (firstMoved) {
        firstMoved.addEventListener(
          "transitionend",
          function clean() {
            allItems.forEach((item) => {
              item.style.transform = "";
              item.style.transition = "";
            });
            firstMoved.removeEventListener("transitionend", clean);
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

const filterButton = document.querySelector("[data-filter-form-button]");

filterButton.addEventListener("click", showFilterMenu);
const filterList = document.querySelector(".filter__list");

function showFilterMenu(event) {
  event.target.classList.toggle("filter__button--active");
  filterList.classList.toggle("filter__list--active");
}

filterList.addEventListener("click", selectFilter);

function selectFilter(event) {
  if (event.target.classList.contains("filter-list__option")) {
    const allItems = [...list.querySelectorAll(".todo__list-item")];
    let firstCheckedIndex = allItems.length;

    for (let i = 0; i < allItems.length; i++) {
      if (allItems[i].classList.contains("checked-item")) {
        firstCheckedIndex = i;
        break;
      }
    }
    switch (event.target.id) {
      case "all":
        resetFilters();
        break;

      case "incomplete":
        for (let i = 0; i < firstCheckedIndex; i++) {
          allItems[i].classList.remove("todo__list-item--hidden");
        }
        for (let i = firstCheckedIndex; i < allItems.length; i++) {
          allItems[i].classList.add("todo__list-item--hidden");
        }
        filterButton.textContent = "incomplete";
        break;
      case "completed":
        for (let i = 0; i < firstCheckedIndex; i++) {
          allItems[i].classList.add("todo__list-item--hidden");
        }
        for (let i = firstCheckedIndex; i < allItems.length; i++) {
          allItems[i].classList.remove("todo__list-item--hidden");
        }
        filterButton.textContent = "completed";
        break;
    }
    filterList.classList.remove("filter__list--active");
  }
}

function resetFilters() {
  const allItems = [...list.querySelectorAll(".todo__list-item")];
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].classList.remove("todo__list-item--hidden");
  }
  filterButton.textContent = "all";
}
