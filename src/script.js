const form = document.querySelector(".todo-form")
const list = document.querySelector(".todo__list") 

form.addEventListener("submit", addItem)

function addItem(event) {
    event.preventDefault()
    console.log("ee")
}