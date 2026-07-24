const userInput = document.getElementById("todoInput");
const btn = document.querySelector(".btn");
const displayTask = document.querySelector(".displayToDo");
const clearAll = document.getElementById("clearBtn");

// counter
const totalTask = document.getElementById("total-task");
const comTask = document.getElementById("com-task");
const remTask = document.getElementById("rem-task");

// filter
const filAll = document.getElementById("filAll");
const filCom = document.getElementById("filCom");
const filRem = document.getElementById("filRem");

// search
const searchInput = document.getElementById("searchInput");

// priority
const priority = document.getElementById("priority");

// sort
const sortpriority = document.getElementById("sort");

// due date
const dueDate = document.getElementById("dueDate");

// empty message
const emptyMsg = document.getElementById("emptyMessage");

//for footer year
const year = document.getElementById("year");
year.textContent = new Date().getFullYear();


// tasks storage
let tasks = [];

try {
    const savedTasks = localStorage.getItem("tasks");
    tasks = savedTasks ? JSON.parse(savedTasks) : [];
} catch {
    tasks = [];
}


// save tasks
function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// empty message
function empMsg(){

    if(!emptyMsg) return;

    if(tasks.length === 0){
        emptyMsg.style.display = "block";
    }else{
        emptyMsg.style.display = "none";
    }

}


// update counter
function updateCounter(){

    totalTask.textContent = "Total Tasks: " + tasks.length;

    const completed = tasks.filter(task => task.completed).length;
    const remaining = tasks.length - completed;

    comTask.textContent = "Completed Tasks: " + completed;
    remTask.textContent = "Remaining Tasks: " + remaining;
}


// create task
function createTask(taskData){

    const container = document.createElement("div");
    container.className = "task-contain";


    const taskElement = document.createElement("p");
    taskElement.textContent = taskData.text;
    taskElement.className = "task-text";


    const taskPriority = document.createElement("p");
taskPriority.textContent = taskData.priority;
taskPriority.className = "task-priority " + taskData.priority.toLowerCase();


    const taskDate = document.createElement("p");
    taskDate.textContent = "Due: " + taskData.dueDate;
    taskDate.className = "task-date";


    if(!taskData.dueDate){
        taskDate.style.display = "none";
    }


    if(taskData.completed){
        taskElement.classList.add("Completed");
    }


    // complete task
    taskElement.addEventListener("click", ()=>{

        taskData.completed = !taskData.completed;

        taskElement.classList.toggle("Completed");

        saveTasks();
        updateCounter();

    });



    // edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";


    editBtn.addEventListener("click", ()=>{

        const newInput = document.createElement("input");
        newInput.value = taskData.text;
        newInput.className = "edit-input";

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.className = "save-btn";


        container.appendChild(newInput);
        container.appendChild(saveBtn);


        saveBtn.addEventListener("click", ()=>{

            if(newInput.value.trim() === ""){
                return;
            }

            taskData.text = newInput.value;

            taskElement.textContent = newInput.value;

            newInput.remove();
            saveBtn.remove();

            saveTasks();

        });


        newInput.addEventListener("keydown", event=>{

            if(event.key === "Enter"){
                saveBtn.click();
            }

        });

    });



    // delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";


    deleteBtn.addEventListener("click", ()=>{

        container.classList.add("task-delete");

        setTimeout(()=>{

            container.remove();

            const index = tasks.indexOf(taskData);

            tasks.splice(index,1);

            saveTasks();
            updateCounter();
            empMsg();

        },400);

    });



    container.appendChild(taskElement);
    container.appendChild(taskPriority);
    container.appendChild(taskDate);
    container.appendChild(editBtn);
    container.appendChild(deleteBtn);


    displayTask.appendChild(container);

}



// load saved tasks
tasks.forEach(task=>{
    createTask(task);
});

empMsg();
updateCounter();



// create task button
btn.addEventListener("click", ()=>{

    const user = userInput.value;


    if(user.trim() === ""){
        return;
    }


    const newTask = {

        text:user,
        completed:false,
        priority:priority.value,
        dueDate:dueDate.value

    };


    tasks.push(newTask);


    saveTasks();

    createTask(newTask);


    empMsg();
    updateCounter();


    userInput.value = "";

});



// press Enter
userInput.addEventListener("keydown", event=>{

    if(event.key === "Enter"){
        btn.click();
    }

});



// clear all
clearAll.addEventListener("click", ()=>{

    tasks.splice(0,tasks.length);

    document.querySelectorAll(".task-contain").forEach(task=>{
        task.remove();
    });

    saveTasks();

    updateCounter();

    empMsg();

});



// filter all
filAll.addEventListener("click", ()=>{

    document.querySelectorAll(".task-contain")
    .forEach(task=>{
        task.style.display="block";
    });

});



// completed filter
filCom.addEventListener("click", ()=>{

    document.querySelectorAll(".task-contain")
    .forEach(container=>{

        const task = container.querySelector(".task-text");

        if(task.classList.contains("Completed")){
            container.style.display="block";
        }else{
            container.style.display="none";
        }

    });

});



// remaining filter
filRem.addEventListener("click", ()=>{

    document.querySelectorAll(".task-contain")
    .forEach(container=>{

        const task = container.querySelector(".task-text");

        if(task.classList.contains("Completed")){
            container.style.display="none";
        }else{
            container.style.display="block";
        }

    });

});



// sorting
sortpriority.addEventListener("change", ()=>{

    const sortValue = sortpriority.value;

    const priorityOrder = {

        High:1,
        Medium:2,
        Low:3

    };


    tasks.sort((a,b)=>{

        if(sortValue === "high-low"){

            return priorityOrder[a.priority] - priorityOrder[b.priority];

        }else{

            return priorityOrder[b.priority] - priorityOrder[a.priority];

        }

    });
    saveTasks();


    document.querySelectorAll(".task-contain").forEach(task=>{
        task.remove();
    });


    tasks.forEach(task=>{
        createTask(task);
    });


});



// search
searchInput.addEventListener("input", ()=>{


    const searchValue = searchInput.value.toLowerCase();


    document.querySelectorAll(".task-contain")
    .forEach(container=>{


        const text = container
        .querySelector(".task-text")
        .textContent
        .toLowerCase();



        if(text.includes(searchValue)){
            container.style.display="block";
        }else{
            container.style.display="none";
        }


    });


});
