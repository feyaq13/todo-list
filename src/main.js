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

  var objectField = document.getElementsByClassName('task-field')

  localStorage.setItem(objectField, fieldToDo.value)
  localStorage.objectField
  // for (var i = 0; i < )
})


// // var objClassesOfElements = {
// //   1: ['input-group', 'mb-3'],
// //   2: 'input-group-prepend',
// //   3: 'input-group-text'
// // }

// function addElementHTML(elem) {
//   var inputGroupAndMb3 = document.createElement(elem);
//   div.appendChild(inputGroupAndMb3);
//   inputGroupAndMb3.classList.add('input-group', 'mb-3');
//   inputGroupAndMb3.innerHTML = '<input type="text" class="form-control" aria-label="Text input with checkbox">'

//   var inputGroupPrepend = document.createElement(elem)
//   inputGroupAndMb3.appendChild(inputGroupPrepend)
//   inputGroupPrepend.classList.add('input-group-prepend')

//   var inputGroupText = document.createElement(elem)
//   inputGroupPrepend.appendChild(inputGroupText)
//   inputGroupText.classList.add('input-group-text')
//   inputGroupText.innerHTML = '<input type="checkbox" aria-label="Checkbox for following text input"></input>'
//   return inputGroupAndMb3
// }

// function addElementHTML () {
//   const contain = document.getElementsByClassName('container')[1];
//   var inputText = contain.insertAdjacentHTML(beforeEnd,'<input type="text" class="form-control" aria-label="Text input with checkbox">')
//   var divInputGroupPrepend = contain.insertAdjacentHTML(afterBegin, '<div class="input-group-prepend"><div>')
//   var divInputGroupText = divInputGroupPrepend.insertAdjacentHTML(afterBegin, '<div class="input-group-text">')
//   var inputCheckbox = divInputGroupText.insertAdjacentHTML(afterBegin,'<input type="checkbox" aria-label="Checkbox for following text input"></input'>)
//   return contain
// }