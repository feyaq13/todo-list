/* eslint-disable no-console */
/**
 * в будущем реализовать через паттерн синглтон
 */
const model = restoreOrCreateModel();
const inputForTask = document.getElementsByClassName("input-add-task")[0];

init();

class Todo {
  constructor(name) {
    const hash = window.murmurHash3.x86.hash128;
    this.name = name;
    this.id = hash(name + Math.random());
  }
}

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

function addTask() {
  const taskName = getTaskName();

  if (!validate()) {
    return;
  }

  model.currentTodos.push(new Todo(taskName));

  resetInputs();
  saveModel(model);
  renderModel(model);
}

function validate() {
  const taskName = getTaskName();
  const buttonAddTask = document.getElementsByClassName("btn-add-task")[0];

  if (!taskName) {
    inputForTask.classList.add("is-invalid");
    buttonAddTask.classList.add("btn-outline-danger");

    return false;
  }

  inputForTask.classList.replace("is-invalid", "is-valid") ||
    inputForTask.classList.add("is-valid");

  buttonAddTask.classList.replace(
    "btn-outline-danger",
    "btn-outline-success"
  ) || buttonAddTask.classList.add("btn-outline-success");

  return true;
}

// отдаёт значение поля таски
function getTaskName() {
  return inputForTask.value;
}

// очищает поле ввода таски
function resetInputs() {
  // todo: помимо очистки поля нужно сбрасывать его цвет
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
  const tasksContainer = document.getElementsByClassName(
    "all-tasks-container"
  )[0];
  tasksContainer.innerHTML = "";

  for (const task of model.currentTodos) {
    tasksContainer.innerHTML += generateTodoHtml(task.name, task.id);
  }

  const tasksListDone = document.getElementsByClassName("tasks-list-done")[0];
  const tasksDone = document.getElementsByClassName("tasks-done")[0];

  tasksDone.innerHTML = "";

  tasksListDone.textContent =
    model.finishedTodos.length > 0
      ? "Завершённые задачи"
      : "Завершённых задач нет";

  for (const task of model.finishedTodos) {
    tasksDone.innerHTML += generateTodoHtml(task.name, task.id, true);
  }

  function generateTodoHtml(name, id, isDone) {
    const templateHtml = `
      <div class="input-group mb-3 task">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <input class="input-checkbox" type="checkbox" ${
              isDone ? "checked" : ""
            } aria-label="Checkbox for following text input">
          </div>
        </div>
        <input value="${name}" data-id="${id}" type="text" class="form-control input-task_checked" aria-label="Text input with checkbox">
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
  inputForTask.focus();
  inputForTask.addEventListener("keydown", enterHandler);
  inputForTask.addEventListener("input", validate);

  const buttonAddTask = document.getElementsByClassName("btn-add-task")[0];
  buttonAddTask.addEventListener("click", addTask);

  const tasksContainer = document.getElementsByClassName(
    "all-tasks-container"
  )[0];
  tasksContainer.addEventListener("click", checkTarget);

  const tasksDoneContainer = document.getElementsByClassName("tasks-done")[0];
  tasksDoneContainer.addEventListener("click", checkTarget);

  renderModel(model);

  function checkTarget(event) {
    if (
      event.target === tasksContainer ||
      event.target === tasksDoneContainer
    ) {
      return;
    }

    triggerTaskCheckbox(event);

    const element = $(event.target.offsetParent).slideToggle(
      "fast",
      afterAnimation
    );

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

function triggerTaskCheckbox(event) {
  event.target.offsetParent.getElementsByClassName(
    "input-checkbox"
  )[0].checked = true;
}

function toggleTodoStatus(element, model) {
  const triggeredElement = element[0].getElementsByClassName(
    "input-task_checked"
  )[0];

  const taskId = String(triggeredElement.dataset.id);

  function findTaskById(id) {
    const allTasks = model.currentTodos.concat(model.finishedTodos);

    return allTasks.find(function(task) {
      return task.id === id;
    });
  }

  let task = findTaskById(taskId);
  const isDone = model.finishedTodos.includes(task);

  if (isDone) {
    model.finishedTodos.splice(model.finishedTodos.indexOf(task), 1);
    model.currentTodos.push(task);
  } else {
    model.currentTodos.splice(model.currentTodos.indexOf(task), 1);
    model.finishedTodos.push(task);
  }

  saveModel(model);
  renderModel(model);
}
