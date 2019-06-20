const searchInputForTask = document.getElementsByClassName('input-group')[0]
const inputForTask = searchInputForTask.getElementsByClassName('input-add-task')[0]

const searchButtonAddTask = searchInputForTask.getElementsByClassName('input-group-append')[0]
const buttonAddTask = searchButtonAddTask.getElementsByClassName('btn-add-task')[0]

const contain = document.getElementsByClassName('all-tasks-field')[0]

const storedTodos = localStorage.todos
const todos = storedTodos ? JSON.parse(storedTodos) : []

for (const todo of todos) {
  contain.innerHTML += addFragmentHtml(todo)
}

buttonAddTask.addEventListener('click', function () {
  var todoName = String(inputForTask.value)

  if (!todoName) {
    alert('Нельзя добавить пустую задачу')

    return
  }

  todos.push(todoName)
  localStorage.todos = JSON.stringify(todos)

  contain.innerHTML += addFragmentHtml(todoName)
  inputForTask.value = null
})

function addFragmentHtml(name) {
  const templateHtml = `
    <div class="input-group mb-3 task">
      <div class="input-group-prepend">
        <div class="input-group-text">
          <input class="input-checkbox" type="checkbox" aria-label="Checkbox for following text input">
        </div>
      </div>
      <input value="${name}" type="text" class="form-control input-task_checked" aria-label="Text input with checkbox">
    </div>
`
  return templateHtml
}

const taskDone = document.getElementsByClassName('task-done')[0]
const inputCheckbox = Array.from(document.getElementsByClassName('input-group-prepend'))
// const task = Array.from(document.getElementsByClassName('task'))
const taskListDone = document.getElementsByClassName('task-list-done')[0]

inputCheckbox.forEach(function (input) {
  input.addEventListener('click', function (event) {
    setTimeout(function () {
      event.target.offsetParent.classList.add('task-hidden')
    }, 900)
    taskListDone.innerHTML = 'Завершённые задачи'
    taskDone.innerHTML += event.target.offsetParent.outerHTML
  })
})
