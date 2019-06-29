const model = restoreOrCreateModel();
const inputForTask = document.getElementsByClassName("input-add-task")[0];
const hash = window.murmurHash3.x86.hash128;

init();

/**
 * Восстанавливает модель из localStorage или создает новую
 */
function restoreOrCreateModel() {

  // восстанавливает модель
  if (localStorage.todosModel) {
    return JSON.parse(localStorage.todosModel);
  }

  // создаёт модель
  const todosModel = {
    currentTodos: [],
    finishedTodos: []
  };

  return todosModel;
}

function addTask(taskName) {
  taskName = getTaskName();
  let id = hash(taskName) + Math.random();

  if (!validate()) {

    return
  }

  /**
   * model.currentTodos = [
   *  {name: 'foo', id: '1jD0fIk'},
   *  {name: 'foo', id: '1gHV0fIk'}
   * ]
   *
   * * * * * * * * потом * * * * * * *
   * class Todo {
   *  constructor(name) {
   *    this.name = name
   *    this.id = MD5(Math.random())
   *  }
   * }
   */
  model.currentTodos.push({ name: taskName, id: id });

  resetInputs();
  saveModel(model);
  renderModel(model);
}

function validate() {
  const taskName = getTaskName();
  const buttonAddTask = document.getElementsByClassName("btn-add-task")[0];
  if (!taskName) {
    inputForTask.classList.add('is-invalid');
    buttonAddTask.classList.add('btn-outline-danger');
    return false;
  } else {
    inputForTask.classList.replace('is-invalid', 'is-valid') || inputForTask.classList.add('is-valid');
    buttonAddTask.classList.replace('btn-outline-danger', 'btn-outline-success') || buttonAddTask.classList.add('btn-outline-success');
    return true;
  }
}

// отдаёт значение поля таски
function getTaskName() {
  return inputForTask.value;
}

// очищает поле ввода таски
function resetInputs() {
  // помимо очистки поля нужно сбрасывать его цвет
  inputForTask.value = null;
}

/**
 * Сохраняет модель в localStorage
 */
function saveModel(model) {
  localStorage.todosModel = JSON.stringify(model);
}

/**
 * Визуализирует модель на странице
 */
function renderModel(model) {
  const tasksContainer = document.getElementsByClassName("all-tasks-container")[0];
  tasksContainer.innerHTML = "";

  for (const task of model.currentTodos) {
    tasksContainer.innerHTML += generateTodoHtml(task.name);
  }

  const tasksListDone = document.getElementsByClassName("tasks-list-done")[0];
  const tasksDone = document.getElementsByClassName("tasks-done")[0];

  tasksDone.innerHTML = "";

  if (model.finishedTodos.length > 0) {
    tasksListDone.textContent = "Завершённые задачи";
  }

  for (const task of model.finishedTodos) {
    tasksDone.innerHTML += generateTodoHtml(task.name, true);
  }

  function generateTodoHtml(name, isDone) {
    const templateHtml = `
      <div class="input-group mb-3 task">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <input class="input-checkbox" type="checkbox" ${
      isDone ? "checked" : ""
      } aria-label="Checkbox for following text input">
          </div>
        </div>
        <input value="${name}" type="text" class="form-control input-task_checked" aria-label="Text input with checkbox">
      </div>
  `;
    return templateHtml;
  }
}

/**
 * Производит инициализацию страницы
 * (добавляет обработчики и тд)
 */
function init() {
  inputForTask.focus()
  inputForTask.addEventListener("keydown", enterHandler);
  inputForTask.addEventListener("input", validate);

  const buttonAddTask = document.getElementsByClassName("btn-add-task")[0];
  buttonAddTask.addEventListener("click", addTask);

  const tasksContainer = document.getElementsByClassName("all-tasks-container")[0];
  tasksContainer.addEventListener("click", checkTarget);

  const tasksDoneContainer = document.getElementsByClassName("tasks-done")[0];
  tasksDoneContainer.addEventListener("click", checkTarget)

  renderModel(model);

  function checkTarget(event) {
    // проверяет на что нажимает пользователь: при попадании мимо нужного блока, просто будет выход из функции
    if (event.target === tasksContainer || event.target === tasksDoneContainer) {
      return;
    }

    triggerTaskCheckbox(event);

    const element = $(event.target.offsetParent).slideToggle("fast", afterAnimation);

    function afterAnimation() {
      toggleTodoStatus(element, model);
      element.slideToggle();
    }
  }

  function enterHandler(e) {
    if (e.key === "Enter") {
      addTask();
    }
  }
}

// TODO: сделать функцию-проверку таски, на наличие метки checked внезависимости от того, находится ли она в currentTodos или в finishedTodos
function triggerTaskCheckbox(event) {
  // toggleCheckTask()
  event.target.offsetParent.getElementsByClassName(
    "input-checkbox"
  )[0].checked = true;
}

function toggleTodoStatus(element, model) {
  const triggeredElement = element[0].getElementsByClassName(
    "input-task_checked"
  )[0];
  const taskName = triggeredElement.value;
  // let task

  function findTask() {
    for (typeTask in model) {
      model[typeTask].find(
        function (task) {
          if (task.name == taskName) {
            return task
          }
        }
      )
      break
    }
  }

  let task = findTask()

  const isDone = model.finishedTodos.includes(task.id);

  if (isDone) {
    model.finishedTodos.splice(model.finishedTodos.indexOf(task.id), 1);
    model.currentTodos.push(task.id);
  } else {
    model.currentTodos.splice(model.currentTodos.indexOf(task.id), 1);
    model.finishedTodos.push(task.id);
  }

  saveModel(model);
  renderModel(model);
}
