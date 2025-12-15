const input = document.getElementById("task-name");
const addBtn = document.getElementById("add-btn");

const allBtn = document.getElementById("all-btn");
const toDoBtn = document.getElementById("todo-btn");
const inProgBtn = document.getElementById("inprog-btn");
const doneBtn = document.getElementById("done-btn");


const containers = [
    document.getElementById("todo-container"),
    document.getElementById("inprog-container"),
    document.getElementById("done-container")
];

// Add Drag & Drop event listeners to the containers
containers.forEach(container => {
    container.addEventListener('dragover', dragOver);
    container.addEventListener('drop', dragDrop);
    // Optional feedback classes
    container.addEventListener('dragenter', (e) => e.target.classList.add('drag-hover'));
    container.addEventListener('dragleave', (e) => e.target.classList.remove('drag-hover'));
});


!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem("tasks"))
render()

function createTask(text) {
    return {
        id: Date.now(),
        isDone: false,
        text: text,
        stage: 0,
        createdAt: Date.now()
    };
}

const UpdateLocalStorage = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

const setContainerInvisible = (id) => {
    containers.forEach((container, index) => {
        const parent = container.closest(".task-container")
        console.log(container.id, parent);
        if (id === -1) {
            parent.classList.remove("invisible")

        }
        else {
            if (index !== id) {
                parent.classList.add("invisible")
            }
            else {
                parent.classList.remove("invisible")
            }
        }
    })
}

allBtn.onclick = () => setContainerInvisible(-1)
toDoBtn.onclick = () => setContainerInvisible(0)
inProgBtn.onclick = () => setContainerInvisible(1)
doneBtn.onclick = () => setContainerInvisible(2)


addBtn.onclick = () => {
    const text = input.value.trim();
    if (!text) return;

    const task = createTask(text);
    tasks.push(task);

    input.value = "";
    UpdateLocalStorage();
    render();
};

function moveLeft(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    if (task.stage > 0) task.stage--;
    // Checkbox logic integration: if moved left from "Done", uncheck it
    if (task.stage < 2 && task.isDone) {
        task.isDone = false;
    }
    UpdateLocalStorage();
    render();
}

function moveRight(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    if (task.stage < 2) task.stage++;
    // Checkbox logic integration: if moved right to "Done" (stage 2), check it
    if (task.stage === 2 && !task.isDone) {
        task.isDone = true;
    }
    UpdateLocalStorage();
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    UpdateLocalStorage();
    render();
}

function changeState(id) {
    const task = tasks.find(t => t.id === id);

    if (task) {
        task.isDone = !task.isDone; 
        console.log(`Task ${id} new state: ${task.isDone}`);

        // If marked as done (true), move to stage 2. If undone (false), move to stage 0.
        if (task.isDone) {
            task.stage = 2;
        } else {
            task.stage = 0;
        }

        UpdateLocalStorage(); 
        render(); 
    } else {
        console.error(`Task with ID ${id} not found.`);
    }
}

let draggedTaskId = null;

function dragStart(event, id) {
    draggedTaskId = id; 

}

function dragOver(event) {
    event.preventDefault(); 
}

function dragDrop(event) {
    event.preventDefault();
    event.target.classList.remove('drag-hover');

    if (!draggedTaskId) return;

    const task = tasks.find(t => t.id === draggedTaskId);
    if (!task) return;

    const droppedContainer = event.currentTarget; // The container element that fired the drop event
    const newStageIndex = containers.indexOf(droppedContainer);

    if (newStageIndex !== -1 && task.stage !== newStageIndex) {
        task.stage = newStageIndex;

        if (newStageIndex === 2) {
            task.isDone = true;
        } else {
            task.isDone = false;
        }

        UpdateLocalStorage();
        render();
    }
    
    // Cleanup
    draggedTaskId = null;
}


function createTaskDOM(task) {
    const card = document.createElement("div");
    card.className = "task-card";

    card.draggable = true;
    card.addEventListener('dragstart', (event) => dragStart(event, task.id));
    card.addEventListener('dragend', (event) => event.target.classList.remove('dragging'));
    
    if (task.isDone) {
        card.classList.add("task-done");
    }

    const p = document.createElement("p");
    p.textContent = task.text;

    const btns = document.createElement("div");
    btns.className = "buttons";

    const btnLeft = document.createElement("button");
    btnLeft.textContent = "<";
    btnLeft.onclick = () => moveLeft(task.id);

    const btnRight = document.createElement("button");
    btnRight.textContent = ">";
    btnRight.onclick = () => moveRight(task.id);

    const btnDel = document.createElement("button");
    btnDel.textContent = "X";
    btnDel.onclick = () => deleteTask(task.id);

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox"; 
    checkBox.checked = task.isDone;

    checkBox.addEventListener('change', () => {
        changeState(task.id);
    });
    
    console.log(task.isDone)

    card.append(checkBox);
    btns.append(btnLeft, btnRight, btnDel);
    card.append(p, btns); 

    return card;
}


function render() {
    containers.forEach(c => c.innerHTML = "");

    for (const task of tasks) {
        const element = createTaskDOM(task);
        containers[task.stage].appendChild(element);
    }
}
