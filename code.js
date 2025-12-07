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

!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem("tasks"))
render()

function createTask(text) {
    return {
        id: Date.now(),
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
    UpdateLocalStorage();
    render();
}

function moveRight(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    if (task.stage < 2) task.stage++;
    UpdateLocalStorage();
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    UpdateLocalStorage();
    render();
}

function createTaskDOM(task) {
    const card = document.createElement("div");
    card.className = "task-card";

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