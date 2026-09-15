let today=[];
let tomorrow=[];
let completed=[];
const main = document.querySelector("main");
const nameInput = document.getElementById("item-name");
const dateInput = document.getElementById("item-date");
const prioritySelect = document.getElementById("priority");
const addBtn = document.querySelector(".input-container button");
const tasksContainer = document.querySelector(".tasks-container");

dateInput.min = getToday();
addBtn.disabled=true;
nameInput.addEventListener("input",updateButton);
dateInput.addEventListener("input",updateButton);
prioritySelect.addEventListener("change",updateButton);

addBtn.addEventListener("click",()=>{
    if(!isFormValid())
            return;
    const item = {
        id: Date.now(),
        name: nameInput.value.trim(),
        date: dateInput.value,
        priority: prioritySelect.value,
        completed: false
    };
    const tasks = JSON.parse(localStorage.getItem("tasks")|| '[]');
    tasks.push(item);
    localStorage.setItem("tasks",JSON.stringify(tasks));
    populateFields();
    // Reset the form
    nameInput.value = "";
    dateInput.value = "";
    prioritySelect.selectedIndex = 0;
    updateButton();
})
tasksContainer.addEventListener("click",(e)=>{
    const btn = e.target.closest("button");
    if(!btn)
        return;
    const id = Number(btn.closest(".card").dataset.id);
    let tasks = JSON.parse(localStorage.getItem("tasks")|| '[]');

    if(btn.classList.contains("complete-btn")){
        const task = tasks.find(t=>t.id === id);
        if(task)
            task.completed = true;
    }
    else if(btn.classList.contains("delete-btn")){
        tasks = tasks.filter(t=>t.id !== id);
    }
    else
        return;

    localStorage.setItem("tasks",JSON.stringify(tasks));
    populateFields();
})
window.addEventListener("DOMContentLoaded",()=>{
    // get items from local storage
   populateFields();
})
function populateFields(){
    tasksContainer.innerHTML='';
    today=[];
    tomorrow=[];
    completed=[];
    const tasks = JSON.parse(localStorage.getItem("tasks")|| '[]');
    // give ids to tasks saved before ids existed
    tasks.forEach((task,i)=>{
        if(task.id === undefined)
            task.id = Date.now() + i;
    });
    localStorage.setItem("tasks",JSON.stringify(tasks));
    tasks.forEach(task=>{
        if(task.completed)
            completed.push(task);
        else if(isToday(task.date))
            today.push(task);
        else
            tomorrow.push(task);
    });
    //should come back here, we need to display each list
    populate(today,"Today's ToDo List");
    populate(tomorrow,"Future ToDo List");
    populate(completed,"Completed ToDo List");
    main.appendChild(tasksContainer);
}
function populate(list,heading){
    const parent = document.createElement("div");
    parent.classList.add("task-list");
    const h1 = document.createElement("h1");
    h1.textContent=heading;
    parent.appendChild(h1);
    list.forEach((item,ind)=>{
        parent.appendChild(generateCard(item,ind));
    });
    tasksContainer.appendChild(parent);
}
function isToday(dataString){
 
    return dataString === getToday();
}
function getToday(){
    const today = new Date();
    const day = String(today.getDate()).padStart(2,'0');
    const month = String(today.getMonth()+1).padStart(2,'0');
    const year = today.getFullYear();

    const todayString = `${year}-${month}-${day}`;
    return todayString;
}
function generateCard(card,sno){
    const entry = document.createElement("div");
    entry.classList.add("card");
    entry.dataset.id = card.id;
    const sDiv=document.createElement("div");
    sDiv.textContent=sno+1;
    entry.appendChild(sDiv);
    for(const [key,value] of Object.entries(card)){
        if(key === 'id')
            continue;
        let div = document.createElement("div");
        if(key === 'completed'){
           div.appendChild(getButton(value));
           entry.appendChild(div);
           div=document.createElement("div");
           div.appendChild(getDeleteButton());
        }
        else{
            div.textContent=value;
        }
        entry.appendChild(div);
    }
    return entry;
}

function getButton(value){
    const btn = document.createElement("button");
    if(!value){
       
        btn.type='button';
        btn.classList.add("complete-btn");
        btn.title="mark as completed";
        btn.textContent="✓";
        
    }
    return btn;
}
function getDeleteButton(){
    const btn = document.createElement("button");
    btn.type='button';
    btn.classList.add("delete-btn");
    btn.title="Delete button";
    btn.textContent="🗑️";
    return btn;
}

function isFormValid(){
    const nameOk = nameInput.value.trim() !== "";
    const dateOk = dateInput.value !== "" && dateInput.value >=getToday();
    const priorityOk = prioritySelect.value !=="";
    return nameOk && dateOk && priorityOk;
}

function updateButton(){
    addBtn.disabled = !isFormValid();
}

