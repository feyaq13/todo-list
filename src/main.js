init()

// TLDR: на данный момент добавленные элементы появляются только после обновления страницы :(

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

  // получить доступ и записывать сюда? как?!

  // создаёт модель
  const todosModel = {
    // сюда нужно добавлять при нажатии на кнопку "Добавить"
    currentTodos: [
      'foo',
      'bar'
    ],

    // пока вообще никак не используется :(
    finishedTodos: []
  }

  return todosModel
}

function addTodo(todoName, model) {
  model = restoreOrCreateModel()
  todoName = getTodoName()

  if (!todoName) {
    alert('Нельзя добавить пустую задачу')

    return
  }

  model.currentTodos.push(todoName)

  clearFieldTask()
  saveModel(model)

  // return model
}

// отдаёт значение поля таски
function getTodoName() {
  const inputForTask = document.getElementsByClassName('input-add-task')[0]
  return inputForTask.value
}

// очищает поле ввода таски
function clearFieldTask() {
  document.getElementsByClassName('input-add-task')[0] = null
}

/**
 * Сохраняет модель в localStorage
 */
function saveModel(model) {
  // написана хрень, работает соответствующе
  const storedTodos = localStorage.todosModel
  const todos = storedTodos ? JSON.parse(storedTodos) : []

  // todos.push(model)
  localStorage.todosModel = JSON.stringify(model)
}

/**
 * Визуализирует модель на странице
 */
function renderModel(model) {
  // сделать проверку на завершённые (есть галочка) / незавершённые-возобновлённые (нет галочки)
  model = restoreOrCreateModel()

  const tasksContainer = document.getElementsByClassName('all-tasks-field')[0]

  for (const todo of model.currentTodos) {
    tasksContainer.innerHTML += addFragmentHtml(todo)
  }

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

/**
 * Производит инициализацию страницы
 * (добавляет обработчики и тд)
 */
function init() {

  // добавляет карточку по нажатию на ENTER
  const inputForTask = document.getElementsByClassName('input-add-task')[0]

  inputForTask.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      // addTodo() // было так
      addTodo
    }
  })
  //

  // добавляет карточку по нажатию кнопки "Добавить"
  const buttonAddTask = document.getElementsByClassName('btn-add-task')[0]

  buttonAddTask.addEventListener('click', addTodo)
  //

  // управляет задачами помеченными как "завершенные"
  const tasksDone = document.getElementsByClassName('tasks-done')[0]
  const taskListDone = document.getElementsByClassName('task-list-done')[0]
  const tasksContainer = document.getElementsByClassName('all-tasks-field')[0]

  tasksContainer.addEventListener('click', function (event) {

    // проверяем на что нажимаем пользователь, при попадании мимо нужного блока, просто будет выход из функции
    if (event.target === tasksContainer) {
      return
    }

    const element = $(event.target.offsetParent).slideToggle('fast', function () {
      tasksDone.appendChild(element.get(0))
      element.slideToggle()
    })

    taskListDone.innerHTML = 'Завершённые задачи'
  })

  const model = restoreOrCreateModel()
  // model === todosModel
  // (пустая из-за невозможности доступа)
  renderModel(model)
}