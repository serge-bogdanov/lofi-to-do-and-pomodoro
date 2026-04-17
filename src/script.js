const form = document.querySelector(".todo-form");
const list = document.querySelector(".todo__list");

form.addEventListener("submit", addItem);

function addItem(event) {
  event.preventDefault();
  let formInput = document.querySelector(".todo-form__input");
  let inputText = formInput.value;

  if (inputText !== "") {
    let item = document.createElement("li");
    item.className = "todo__list-item";

    let textNode = document.createTextNode(inputText);
    item.appendChild(textNode);

    let deleteButton = document.createElement("button");
    deleteButton.appendChild(document.createTextNode("X"));
    deleteButton.className = "todo-item__button";
    deleteButton.dataset.action = "delete";
    item.appendChild(deleteButton);

    list.prepend(item);

    formInput.value = "";
  }
}

list.addEventListener("click", deleteItem);

function deleteItem(event) {
  if (
    event.target.hasAttribute("data-action") &&
    event.target.getAttribute("data-action") === "delete"
  ) {
    event.target.parentNode.remove();
  }
}
