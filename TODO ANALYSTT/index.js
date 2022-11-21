//Data 

// We need to access the form element
var form = document.getElementById("todoForm");

// to takeover its submit event.
form.addEventListener("submit", function(event) {
  event.preventDefault();

  submitTodo(event);
});

var todoItemTemplate = "<li draggable='true' class='todo-item {{priorityClass}}'><div class='card'><h3 class='todo-title '> <span class='action'><i class='icon-delete material-icons md-36 '>delete</i><i class='icon-checkbox-outline material-icons md-36 md-dark'>check_box_outline_blank</i><i class='icon-checkbox material-icons md-36 md-light'>check_box</i></span> <span class='title'>{{title}}</span> </h3> <p class='todo-description'> {{description}} </p> <span class='todo-priority {{priorityClass}}'> {{priority}} </span> </div></li>";

function addEventListenerByClass(className, event, fn) {
  var list = document.getElementsByClassName(className);
  for (var i = 0, len = list.length; i < len; i++) {
    list[i].addEventListener(event, fn, false);
  }
}

addEventListenerByClass('todo-list', 'click', handleClick);

function handleClick(e) {
  var targetItem = e.target;
  var listItem = getClosest(e.target, 'li');
  console.log(e.target.className);
  
   if (listItem.className.includes('new')) {
    handleAdd(listItem);
    e.stopPropagation();
  }
  
  if (e.target.className.includes('complete')) {
    handleComplete(listItem);
    e.stopPropagation();
  }
  if (e.target.className.includes('close')) {
    handleDelete(listItem);
    e.stopPropagation();
  } 
  else {
    //handleEdit(listItem);
  }

}

function handleAdd(){
  var mainWrap = document.querySelector('.main-wrap');
  mainWrap.classList.toggle('hidden');
}

function handleComplete(listItem) {
  var target = document.querySelector('.todo-list-completed');
  var className = listItem.className;
  var newListEl = document.createElement('li');
 newListEl.innerText = listItem.querySelector('.todo-title .title').innerText;
  newListEl.setAttribute('class',className);
  
  target.appendChild(newListEl);
  
  listItem.parentNode.removeChild(listItem);
}

function handleDelete(listItem) {
  fadeOut(listItem);
  
}

function handleEdit(listItem) {
  var todoItemToEdit = {};
  todoItemToEdit.title = listItem.querySelector('.todo-title').innerText;
  todoItemToEdit.description = listItem.querySelector('.todo-description').innerText;
  todoItemToEdit.priority = listItem.querySelector('.todo-priority').innerText;

  fillForm(todoItemToEdit);
}

function fillForm(todoItem) {
  form.reset();

  var titleEl = form.querySelector('#title');
  var descriptionEl = form.querySelector('#description');
  var priorityEl = form.querySelector('#priority');

  titleEl.value = todoItem.title;
  descriptionEl.value = todoItem.description;

}

function submitTodo(e) {

  var titleEl = form.querySelector('#title');
  var descriptionEl = form.querySelector('#description');
  var priorityEl = form.querySelector('#priority');

  var todoItem = {};

  if (titleEl) {
    todoItem.title = titleEl.value;
  }

  if (descriptionEl) {
    todoItem.description = descriptionEl.value;
  }

  if (priorityEl) {
    todoItem.priority = priorityEl.options[priorityEl.selectedIndex].text;
  }

  console.log(todoItem);
  addTodo(todoItem);
  
  var mainWrap = document.querySelector('.main-wrap');
  mainWrap.classList.toggle('hidden');

}

function createElement(todoItem) {
  var elementInnerHTML = todoItemTemplate.replace("{{title}}", todoItem.title).replace("{{description}}", todoItem.description).replace("{{priorityClass}}", todoItem.priority.toLowerCase()).replace("{{priorityClass}}", todoItem.priority.toLowerCase()).replace("{{priority}}", todoItem.priority);

  console.log(elementInnerHTML);
  return elementInnerHTML;
};

function addTodo(todoItem) {
  var target = document.getElementById('target');
  target.innerHTML += createElement(todoItem);
}

function getClosest(el, tag) {
  // this is necessary since nodeName is always in upper case
  tag = tag.toUpperCase();
  do {
    if (el.nodeName === tag) {
      // tag name is found! let's return it. :)
      return el;
    }
  } while (el = el.parentNode);

  // not found :(
  return null;
}

function sortCards() {
  var list = document.getElementById('mylist');
  var items = list.childNodes;
  var itemsArr = [];
  for (var i in items) {
    if (items[i].nodeType == 1) { // get rid of the whitespace text nodes
      itemsArr.push(items[i]);
    }
  }

  itemsArr.sort(function(a, b) {
    return a.innerHTML == b.innerHTML ? 0 : (a.innerHTML > b.innerHTML ? 1 : -1);
  });

  for (i = 0; i < itemsArr.length; ++i) {
    list.appendChild(itemsArr[i]);
  }
}

// fade out

function fadeOut(el) {
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= .03) < 0) {
      el.parentNode.removeChild(el);
    } else {
      requestAnimationFrame(fade);
    }
  })();
}

// fade in

function fadeIn(el, display) {
  el.style.opacity = 0;
  el.style.display = display || "block";

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += .1) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}

var dragSrcEl = null;

function handleDragStart(e) {
  // Target (this) element is the source node.

  this.classList.add('opaque');
  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

var cols = document.querySelectorAll('.todo-item');
[].forEach.call(cols, function(col) {
  col.addEventListener('dragstart', handleDragStart, false);
  col.addEventListener('dragenter', handleDragEnter, false)
  col.addEventListener('dragover', handleDragOver, false);
  col.addEventListener('dragleave', handleDragLeave, false);
  col.addEventListener('drop', handleDrop, false);
  col.addEventListener('dragend', handleDragEnd, false);
});

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.

  return false;
}

function handleDragEnter(e) {
  
  this.classList.add('over');
}

function handleDragLeave(e) {
  this.classList.remove('over'); // this / e.target is previous target element.
}

function handleDrop(e) {
  // this/e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // Stops some browsers from redirecting.
  }

  // Don't do anything if dropping the same column we're dragging.
  if (dragSrcEl != this) {
    // Set the source column's HTML to the HTML of the column we dropped on.
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }

  this.style.opacity = '1';
  return false;
}

function handleDragEnd(e) {
  // this/e.target is the source node.

  [].forEach.call(cols, function(col) {
    col.classList.remove('over');
    col.classList.remove('opaque');
  });
}