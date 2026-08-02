const taskInput = document.getElementById("task");
const theme = document.getElementById("light");
const priority = document.getElementById("priority");
const addBtn = document.getElementById("add-btn");
const search = document.getElementById("search");
const all = document.getElementById("all");
const active = document.getElementById("active");
const completed = document.getElementById("completed");
const sort = document.getElementById("sort");
const total = document.getElementById("total-count");
const cc = document.getElementById("completed-count");
const penc = document.getElementById("pending-count");
const proc = document.getElementById("progress-count");
const taskl = document.getElementById("task-list");
const message = document.getElementById("no-task-message");
const clearcom = document.getElementById("clear-completed");
const deleteall = document.getElementById("delete-all");
const body=document.getElementById('change');

let tasks = [];
let id = 0;
let pendingCount = 0;
let progress = 0;
let edit = false;
let newid;
loadTasks();
renderTasks(tasks);
getTheme();

if(tasks.length > 0){
    id = tasks[tasks.length - 1].id;
}
addBtn.addEventListener("click", function () {
    
    let input = taskInput.value;
    let prior = priority.value;
    let checker=input.toLowerCase();
    
        if (input.trim() === '') {
        alert('enter a valid input');
        return;
    }
    if (edit === true) {
        tasks.forEach((task) => {
               if (task.id == newid) {
                task.text = input;
                task.priority = prior;
            }
            saveTasks(tasks);
        });
        edit = false;
        newid = null;
        addBtn.innerHTML = "Add";
        
    }
    else {
     let duplicates = tasks.some((task)=>{
    return checker == task.text.toLowerCase();
});

if(duplicates){
    taskInput.value='';
    alert("duplicates are not allowed");
    
    return;
}
    

        ++id;
        tasks.push({
            id: id,
            text: input,
            priority: prior,
            date: new Date().toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour12: true,
                hour: '2-digit',
                minute: '2-digit',
            }),
            completed: false
        });
    }
    taskInput.value = "";
    renderTasks(tasks);
    saveTasks(tasks);
})
;

function renderTasks(array = tasks) {
    statistics();
    taskl.innerHTML = "";
    message.innerHTML = ''
    if (array.length == 0) {
      
        message.innerHTML = "No Task Found";
        return;
    }

    array.forEach(function (task) {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks(tasks);
            renderTasks(tasks);
        });
        const li = document.createElement("li");
        li.innerHTML = ` 
    <span>
    
    ${task.text}
    <span>
    <br>  
         
        Created-${task.date}  
        <br>
       Priority- ${task.priority}
        `;


        let deletebtn = document.createElement("button");
        deletebtn.innerHTML = "delete";
        li.append(deletebtn);
        deletebtn.addEventListener("click", function () {
            console.log(task.id);
            tasks = tasks.filter(function (onetask) {
                return onetask.id != task.id;


            })
            saveTasks(tasks);
            renderTasks(tasks);

        })

        let editbtn = document.createElement("button");
        editbtn.innerHTML = "Edit";
        li.append(editbtn);
        editbtn.addEventListener("click", function (event) {
            edit = true;
            taskInput.value = task.text;
            priority.value = task.priority;
            newid = task.id;
            addBtn.innerHTML = "Save";
        })

        taskl.appendChild(li);
        li.prepend(checkbox);
    });

}

function statistics() {
    let totalCount = tasks.length;
    total.innerHTML = totalCount;
    let completedCount = tasks.filter(function (task) {
        return task.completed;
    }).length;
    cc.innerHTML = completedCount;
    pendingCount = totalCount - completedCount;
    penc.innerHTML = pendingCount;
    if (totalCount == 0) {
        progress = 0;

    }
    else {
        progress = Math.round((completedCount / totalCount) * 100);
    }

    proc.innerHTML = progress + "%";
}
search.addEventListener("input", function (event) {
    let content = event.target.value.toLowerCase();
    console.log(content);
    searches(content);
})
function searches(input) {
    let matchingTasks = [];
    if (input == '') {
        renderTasks();
        return;
    }
    tasks.forEach(function (task) {
        let t = task.text.toLowerCase();


        if (t.includes(input)) {
            matchingTasks.push(task);
        }

        console.log(matchingTasks);

    });
    renderTasks(matchingTasks);

}
all.addEventListener("click", function () {
    renderTasks();
    
});
completed.addEventListener("click", function () {
    let task = tasks.filter(function (task) {
        return task.completed;
    })
    renderTasks(task);
});
active.addEventListener("click", function () {
    let task = tasks.filter(function (task) {
        return !task.completed;
    })
    renderTasks(task);
});

sort.addEventListener("change", function (event) {
    let change = event.target.value;

    if (change == "A-Z") {
        let az = tasks.sort((task1, task2) => {
            return task1.text.localeCompare(task2.text);

        });

        renderTasks(az);
    }
    else if (change == 'Z-A') {
        let za = tasks.sort((task1, task2) => {
            return task2.text.localeCompare(task1.text);
        });
        renderTasks(za);
    }
    else if (change == 'Newest First') {
        let newF = tasks.sort((task1, task2) => {
            return task2.id - task1.id;
        })
        renderTasks(newF);
    }
    else {
        let oldf = tasks.sort((task1, task2) => {
            return task1.id - task2.id;
        })
        renderTasks(oldf);
    }

})

clearcom.addEventListener('click',function(event){

tasks=tasks.filter(function(task){
                return !task.completed;
            })
            saveTasks(tasks);
         renderTasks(tasks)
        }
   
    )
deleteall.addEventListener('click',function(event){
    
    const userchoice=confirm("Do u wanna delete?");
    if(userchoice){
        alert("all are deleted");
        tasks=[];
        saveTasks(tasks);
         renderTasks(tasks);
    }
   
})


function saveTasks(tasks){
let savet=localStorage.setItem('save',JSON.stringify(tasks));
}
function loadTasks(){
    if(localStorage.getItem('save')){
    tasks=JSON.parse(localStorage.getItem('save'));
    }
    else{
        tasks=[];
    }
}

function saveTheme(theme){
    localStorage.setItem('theme',theme);
}
function getTheme(){

    let savedTheme = localStorage.getItem('theme');

    if(savedTheme === "dark"){
        body.classList.add("dark");
        theme.innerHTML = "Light Mode";
    }
    else{
        body.classList.remove("dark");
        theme.innerHTML = "Dark Mode";
    }

}
theme.addEventListener('click', function(){

    let themes = theme.innerHTML;

    if(themes == "Dark Mode"){

        theme.innerHTML = "Light Mode";
        body.classList.add("dark");
        saveTheme("dark");

    }
    else{

        theme.innerHTML = "Dark Mode";
        body.classList.remove("dark");
        saveTheme("light");

    }

});