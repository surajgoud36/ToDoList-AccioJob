const today=[];
const tomorrow=[];
const completed=[];
const main = document.querySelector("main");
window.addEventListener("DOMContentLoaded",()=>{
    // get items from local storage
    const tasks = JSON.parse(localStorage.getItem("tasks")|| '[]');
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
})
function populate(list,heading){
    const parent = document.createElement("div");
    parent.classList.add("task-list");
    const h1 = document.createElement("h1");
    h1.textContent=heading;
    parent.appendChild(h1);
    list.forEach((item,ind)=>{
        parent.appendChild(generateCard(item.ind));
    });
    main.appendChild(parent);
}
function isToday(dataString){
    const today = new Date();
    const day = String(today.getDate()).padStart(2,'0');
    const month = String(today.getMonth()+1).padStart(2,'0');
    const year = today.getFullYear();

    const todayString = `${day}-${month}-${year}`;
    return dataString === todayString;
}
function generateCard(card,sno){
    const entry = document.createElement("div");
    entry.classList.add("card");
    const sDiv=document.createElement("div");
    sDiv.textContent=sno;
    entry.appendChild(sDiv);
    for(const [key,value] of Object.entries(card)){
        const div = document.createElement("div");
        if(key === 'completed'){
           div.appendChild(getButton(value));
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
    else{
        btn.type='button';
        btn.classList.add("delete-btn");
        btn.title="Delete button";
        btn.textContent="🗑️";
    }
    return btn;
}