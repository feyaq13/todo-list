const searchInputForTask = document.getElementsByClassName('input-group')[0];
const inputForTask = searchInputForTask.getElementsByClassName('input-add-tasks')[0];

const searchButtonAddTask = searchInputForTask.getElementsByClassName('input-group-append')[0];
const buttonAddTask = searchButtonAddTask.getElementsByClassName('btn-add-task')[0];

const contain = document.getElementsByClassName('task-field')[0];

const storedTodos = localStorage.todos
const todos = storedTodos ? JSON.parse(storedTodos) : []

for (const todo of todos) {
  const templateHtml = `
    <div class="container task-field">
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <input type="checkbox" aria-label="Checkbox for following text input">
          </div>
        </div>
        <input value="${todo}" type="text" class="form-control" aria-label="Text input with checkbox">
      </div>
    </div>
  `

  contain.innerHTML += templateHtml
}

buttonAddTask.addEventListener('click', function () {
  var todoName = String(inputForTask.value);

  if (!todoName) {
    alert('Нельзя добавить пустую задачу');

    return
  }

  todos.push(todoName)
  localStorage.todos = JSON.stringify(todos)

  const templateHtml = `
    <div class="container task-field">
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <input type="checkbox" aria-label="Checkbox for following text input">
          </div>
        </div>
        <input value="${todoName}" type="text" class="form-control" aria-label="Text input with checkbox">
      </div>
    </div>
  `

  contain.innerHTML += templateHtml
  inputForTask.value = null
})