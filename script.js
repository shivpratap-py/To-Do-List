const taskInput = document.getElementById("task");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const stats = document.getElementById("stats");

const lowBtn = document.getElementById("low-btn");
const mediumBtn = document.getElementById("medium-btn");
const highBtn = document.getElementById("high-btn");

const filterBtns = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("theme-toggle");

let selectedPriority = "medium";
let currentFilter = "all";

const clearCompletedBtn =
    document.getElementById(
        "clear-completed-btn"
    );

let tasks = JSON.parse(
    localStorage.getItem("tasks")
) || [];

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

clearCompletedBtn.addEventListener(
    "click",
    () => {
        tasks = tasks.filter(
            task => !task.completed
        );

        saveTasks();
        renderTasks();
    }
);

function updateStats() {
    const done = tasks.filter(
        task => task.completed
    ).length;

    const remaining =
        tasks.length - done;

    stats.textContent =
        `${remaining} remaining · ${done} done`;
}

function clearPrioritySelection() {
    lowBtn.classList.remove("active-low");
    mediumBtn.classList.remove("active-medium");
    highBtn.classList.remove("active-high");
}

lowBtn.addEventListener("click", () => {
    clearPrioritySelection();
    lowBtn.classList.add("active-low");
    selectedPriority = "low";
});

mediumBtn.addEventListener("click", () => {
    clearPrioritySelection();
    mediumBtn.classList.add("active-medium");
    selectedPriority = "medium";
});

highBtn.addEventListener("click", () => {
    clearPrioritySelection();
    highBtn.classList.add("active-high");
    selectedPriority = "high";
});

mediumBtn.classList.add("active-medium");

function createTaskElement(task) {
    const taskEl =
        document.createElement("div");

    taskEl.className = "task";

    taskEl.innerHTML = `
        <div class="task-right">
            <div class="taskbtn">
                <input type="checkbox"
                    ${task.completed ? "checked" : ""}
                >
            </div>

            <span
                style="
                ${
                    task.completed
                    ? "text-decoration:line-through;opacity:.6;"
                    : ""
                }
                "
            >
                ${task.text}
            </span>
        </div>

        <div class="task-left">
            <span
                class="priority-dot ${task.priority}"
            ></span>

            <button class="delete-btn">
                ✕
            </button>
        </div>
    `;

    const checkbox =
        taskEl.querySelector("input");

    checkbox.addEventListener(
        "change",
        () => {
            task.completed =
                checkbox.checked;

            saveTasks();
            renderTasks();
        }
    );

    const deleteBtn =
        taskEl.querySelector(".delete-btn");

    deleteBtn.addEventListener(
        "click",
        () => {
            tasks = tasks.filter(
                t => t.id !== task.id
            );

            saveTasks();
            renderTasks();
        }
    );

    return taskEl;
}

function renderTasks() {
    taskList.innerHTML = "";
    const completedCount =
    tasks.filter(
        task => task.completed
    ).length;

clearCompletedBtn.style.display =
    completedCount > 0
        ? "block"
        : "none";
    let filteredTasks = [...tasks];

    if (currentFilter === "active") {
        filteredTasks =
            filteredTasks.filter(
                task => !task.completed
            );
    }

    if (currentFilter === "done") {
        filteredTasks =
            filteredTasks.filter(
                task => task.completed
            );
    }

    filteredTasks.forEach(task => {
        taskList.appendChild(
            createTaskElement(task)
        );
    });

    updateStats();
}

function addTask() {
    const text =
        taskInput.value.trim();

    if (!text) return;

    tasks.unshift({
        id: Date.now(),
        text,
        priority: selectedPriority,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
}

addBtn.addEventListener(
    "click",
    addTask
);

taskInput.addEventListener(
    "keydown",
    e => {
        if (e.key === "Enter") {
            addTask();
        }
    }
);

filterBtns.forEach(btn => {
    btn.addEventListener(
        "click",
        () => {
            filterBtns.forEach(
                b =>
                b.classList.remove(
                    "active"
                )
            );

            btn.classList.add(
                "active"
            );

            currentFilter =
                btn.dataset.filter;

            renderTasks();
        }
    );
});

function setTheme(theme) {
    if (theme === "light") {
        document.body.classList.add(
            "light-theme"
        );
    } else {
        document.body.classList.remove(
            "light-theme"
        );
    }

    localStorage.setItem(
        "theme",
        theme
    );
}

themeToggle.addEventListener(
    "click",
    () => {
        const current =
            localStorage.getItem(
                "theme"
            ) || "dark";

        setTheme(
            current === "dark"
                ? "light"
                : "dark"
        );
    }
);

setTheme(
    localStorage.getItem(
        "theme"
    ) || "dark"
);

renderTasks();