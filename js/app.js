/////////////////////GLOBALS
//ADD TASK FORM
const addTask = document.querySelector('#add-task');
//ADD TASK INPUT
const taskAdded = document.querySelector('#add-task input');
//TASK LIST FORM
const taskList = document.querySelector('#task-list');
//INCREMENTOR FOR TASK ID
let idNum = 1;
//TASK OBJECT TO SAVE IN LOCAL
let tasksArray = (localStorage.getItem('Tasks') === null) ? [['']] : [JSON.parse(localStorage.Tasks)];

////////////////////FUNCTIONS
//HELPER TO MAKE TASK ARRAY - CALL WITH EVERY USER INPUT
function makeTaskArray() {
    let arr = [];
    let tasks = document.querySelectorAll('#task-list input');
    for(let task of tasks) {
       let taskStatus = task.classList.contains('completed') ? 'completed' : 'active';
        arr.push({'id': parseInt(task.getAttribute('data-id')), 'task':task.value, 'status': taskStatus});
    } 
    return arr;
}

//FUNCTION TO DELETE TASK
function deleteTask(element, id) {
    let result = confirm(`Are you sure you want to delete task #${id}?`);
    if(result) {
        element.remove();
        tasksArray = makeTaskArray();
        localStorage.setItem('Tasks', JSON.stringify(tasksArray));
    }
}

//FUNCTION TO MAKE A TASK
function makeTask(value, status) {
        //CREATE A TASK CONTAINER TO HOLD TASK AND ACTIONS
        const newTaskContainer = document.createElement('div');
        newTaskContainer.classList.add('task-control');

        //CREATE A TASK DELETE BUTTON 
        const deleteBtn = document.createElement('i');
        deleteBtn.classList.add('fa', 'fa-trash-alt');

        //CREATE A NEW TASK
        const newTask = document.createElement('input');
        newTask.value = value;
        newTask.readOnly = true;
        newTask.type = "text";
        newTask.classList.add('task');
        //GIVE TASK ID
        newTask.setAttribute('data-id', idNum);

        //CLEAR NEW TASK INPUT
        taskAdded.value = "";
        

        if (status === 'active') {
            newTask.classList.add('editable');
            //MAKE MARK COMPLETED ICON
            const markCompleted = document.createElement('i');
            markCompleted.classList.add('far', 'fa-circle');

            //ADD NEW ELEMENTS TO THE PAGE
            newTaskContainer.appendChild(markCompleted);
            newTaskContainer.appendChild(newTask);
            newTaskContainer.appendChild(deleteBtn);
            taskList.prepend(newTaskContainer);
            

        } else if (status === 'completed') {
            
            //ADD COMPLETED CLASSES TO TASK
            newTask.classList.add('completed');
            newTaskContainer.classList.add('task-control-completed');

            //MAKE MARK COMPLETED ICON
            const markCompleted = document.createElement('i');
            markCompleted.classList.add('far', 'fa-check-circle');

            //ADD NEW ELEMENTS TO THE PAGE
            newTaskContainer.appendChild(markCompleted);
            newTaskContainer.appendChild(newTask);
            newTaskContainer.appendChild(deleteBtn);

            taskList.prepend(newTaskContainer);
         }
        //INCREMENT ID
        idNum ++;
}

////////////////////EVENTS
///POPLUATE TASK LIST WITH OBJECT IN LOCAL STORAGE
if(Array.isArray(tasksArray) || tasksArray.length) {
    
    let revserseTasks = tasksArray[0].reverse();

    for (let i = 0; i < revserseTasks.length; i++) {
        if(revserseTasks[i]['status'] === 'completed') {
            makeTask(revserseTasks[i]['task'], revserseTasks[i]['status']);
        }
    }

    for (let i = 0; i < revserseTasks.length; i++) {
        if(revserseTasks[i]['status'] === 'active') {
            makeTask(revserseTasks[i]['task'], revserseTasks[i]['status']);
        }
    }

            //REMAKE TASK ARRAY
            tasksArray = makeTaskArray();
            //ADD TASK OBJECT TO LOCAL STORAGE
            localStorage.setItem('Tasks', JSON.stringify(tasksArray));

}

///ADD TASK EVENT LISTENER
addTask.addEventListener('submit', function(e) {
    e.preventDefault();

    if(taskAdded.value === "") { 
        alert("You can't DO nothing!");
    } else {
        makeTask(taskAdded.value, 'active', 'add');

        //REMAKE TASK ARRAY
        tasksArray = makeTaskArray();

        //ADD TASK OBJECT TO LOCAL STORAGE
        localStorage.setItem('Tasks', JSON.stringify(tasksArray));
    }
});


///EVENT LISTENER FOR TASK LIST ACTIONS:
//Actions include Mark Complete, Edit, Delete;
taskList.addEventListener('click', function(e) {
    e.preventDefault();

    //ENTER EDIT TASK STATE
    if (e.target.classList.contains('editable')) {
        const parent = e.target.parentElement;
        const doneEdting = document.createElement('i');
        doneEdting.classList.add('far', 'fa-times-circle');

        parent.childNodes[0].classList.add('hide');
        parent.childNodes[1].readOnly = false;
        parent.childNodes[1].classList.add('active-task');
        parent.childNodes[1].classList.remove('editable');

        parent.childNodes[2].classList.add('hide');

        parent.prepend(doneEdting);

    //DONE EDTING
    } else if (e.target.classList.contains('fa-times-circle')) {
        const parent = e.target.parentElement;
        parent.childNodes[0].classList.add('hide');
        parent.childNodes[1].classList.remove('hide');
        parent.childNodes[2].readOnly = true;
        parent.childNodes[2].classList.remove('active-task');
        parent.childNodes[2].classList.add('editable');
        parent.childNodes[3].classList.remove('hide');
        e.target.remove();

        tasksArray = makeTaskArray();
        localStorage.setItem('Tasks', JSON.stringify(tasksArray));

    //MARK COMPLETE
    }  else if (e.target.classList.contains('fa-circle')) { 
        
        e.target.classList.remove('fa-circle');
        e.target.classList.add('fa-check-circle');
        e.target.parentElement.classList.add('task-control-completed');
        const taskInput = e.target.nextSibling;
        taskInput.classList.add('completed');
        taskInput.classList.remove('editable');
        taskInput.nextSibling.classList.remove('hide');
        
        //REMAKE TASK ARRAY
        tasksArray = makeTaskArray();
        localStorage.setItem('Tasks', JSON.stringify(tasksArray));

   //DELETE TASK
    } else if (e.target.classList.contains('fa-trash-alt')) {
        deleteTask(e.target.parentElement, e.target.parentElement.childNodes[1].getAttribute('data-id'));
    }
});


