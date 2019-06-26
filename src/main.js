init()

/**
 * Восстанавливает модель из localStorage или создает новую
 */
function restoreOrCreateModel() {
  //
  // https://repl.it/@feyaq13/createCardTask
  // https://repl.it/@feyaq13/functionalAdding
  //

  // восстанавливает модель
  if (localStorage.todosModel) {
    return JSON.parse(localStorage.todosModel)
  }

  // создаёт модель
  const todosModel = {
    // добавляется при нажатии на кнопку "Добавить"
    currentTodos: [],
    // перемещается по клику на таске, которая уже существует
    finishedTodos: []
  }

  return todosModel
}

function addTodo(todoName, model) {
  model = restoreOrCreateModel()
  todoName = getTodoName()

  // TODO: сделать нормальную валидацию
  if (!todoName) {
    alert('Нельзя добавить пустую задачу')

    return
  }

  model.currentTodos.push(todoName)

  clearFieldTask()

  saveModel(model)
  renderModel(model)
}

// отдаёт значение поля таски
function getTodoName() {
  const inputForTask = document.getElementsByClassName('input-add-task')[0]
  return inputForTask.value
}

// очищает поле ввода таски
function clearFieldTask() {
  document.getElementsByClassName('input-add-task')[0].value = null
}

/**
 * Сохраняет модель в localStorage
 */
function saveModel(model) {
  localStorage.todosModel = JSON.stringify(model)
}

/**
 * Визуализирует модель на странице
 */
// TODO: проверить количество отрисовок
function renderModel(model) {

  model = restoreOrCreateModel()

  const tasksContainer = document.getElementsByClassName('all-tasks-field')[0]

  tasksContainer.innerHTML = ''

  for (const todo of model.currentTodos) {
    tasksContainer.innerHTML += addFragmentHtml(todo)
  }

  // TODO: сделать шаблонизацию
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
}

function renderDoneTodo(model) {

  model = restoreOrCreateModel()

  const tasksListDone = document.getElementsByClassName('tasks-list-done')[0]
  const tasksDone = document.getElementsByClassName('tasks-done')[0]

  tasksDone.innerHTML = ''

  if (model.finishedTodos.length > 0) {
    tasksListDone.textContent = 'Завершённые задачи'
  }

  for (const todo of model.finishedTodos) {
    tasksDone.innerHTML += addFragmentHtml(todo)
  }

  // TODO: сделать шаблонизацию
  function addFragmentHtml(name) {
    const templateHtml = `
      <div class="input-group mb-3 task">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <input class="input-checkbox" type="checkbox" checked aria-label="Checkbox for following text input">
          </div>
        </div>
        <input value="${name}" type="text" class="form-control input-task_checked" aria-label="Text input with checkbox">
      </div>
  `
    return templateHtml
  }
}

/**
 * Производит инициализацию страницы
 * (добавляет обработчики и тд)
 */
function init() {

  const inputForTask = document.getElementsByClassName('input-add-task')[0]

  // добавляет карточку по нажатию на ENTER
  inputForTask.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      addTodo()
    }
  })

  // добавляет карточку по нажатию кнопки "Добавить"
  const buttonAddTask = document.getElementsByClassName('btn-add-task')[0]

  buttonAddTask.addEventListener('click', addTodo)
  //

  // управляет задачами помеченными как "завершенные"
  const tasksDoneBlock = document.getElementsByClassName('tasks-done')[0]
  const tasksContainer = document.getElementsByClassName('all-tasks-field')[0]


  tasksContainer.addEventListener('click', function (event) {
    // проверяем на что нажимает пользователь: при попадании мимо нужного блока, просто будет выход из функции
    if (event.target === tasksContainer) {
      return
    }

    checkedTask(event)

    const element = $(event.target.offsetParent).slideToggle('fast', function () {

      // doneTodo(element, model)
      tasksDoneBlock.appendChild(element.get(0))
      element.slideToggle()
    })

  })

  const model = restoreOrCreateModel()
  renderModel(model)
  renderDoneTodo(model)
}

// TODO: сделать функцию-проверку таски, на наличие метки checked внезависимости от того, находится ли она в currentTodos или в finishedTodos
function checkedTask(event) { // toggleCheckTask()
  event.target.offsetParent.getElementsByClassName('input-checkbox')[0].checked = true
}

function doneTodo(element, model) {
  model = restoreOrCreateModel()

  const doneTask = element[0].getElementsByClassName('input-task_checked')[0].value

  model.currentTodos.splice(model.currentTodos.indexOf(doneTask), 1)
  model.finishedTodos.push(doneTask)

  saveModel(model)
  renderModel(model)
  renderDoneTodo(model)
}