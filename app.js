const addTaskBtn = document.getElementById("addTask");
const taskInput = document.getElementById("taskInput");
const taskCategory = document.getElementById("taskCategory");
const taskDate = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");
const quoteBox = document.getElementById("quoteBox");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "All";
let currentDateFilter = null;

const quotes = [
  "Stay positive and keep moving forward!",
  "Small steps every day lead to big results.",
  "Focus on progress, not perfection.",
  "Your future is created by what you do today.",
  "Do it now, sometimes 'later' becomes 'never'."
];

// Add Task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const category = taskCategory.value;
  const dueDate = taskDate.value;
  if (text === "") return;

  tasks.push({ text, completed: false, category, dueDate });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  taskDate.value = "";
  displayTasks();
});

// Display Tasks
function displayTasks() {
  taskList.innerHTML = "";
  tasks
    .filter(task => currentFilter === "All" || task.category === currentFilter)
    .filter(task => !currentDateFilter || task.dueDate === currentDateFilter)
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
      li.innerHTML = `
        <div>
          <span>${task.text}</span>
          <span class="category">[${task.category}]</span>
          ${task.dueDate ? `<span class="date">📅 ${task.dueDate}</span>` : ""}
        </div>
        <div>
          <button onclick="toggleComplete(${index})">✔</button>
          <button onclick="deleteTask(${index})">🗑</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  updateProgress();
}

// Toggle Complete
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  if (tasks[index].completed) launchConfetti();
  displayTasks();
}

// Delete Task
function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

// Update Progress Bar
function updateProgress() {
  const completed = tasks.filter(t => t.completed).length;
  const percent = tasks.length ? (completed / tasks.length) * 100 : 0;
  document.getElementById("progressBar").style.width = percent + "%";
}

// Confetti Effect
function launchConfetti() {
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
    confetti.style.animationDuration = 2 + Math.random() * 3 + "s";
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
  }
}

// Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
});

// Filter Category
function filterCategory(category) {
  currentFilter = category;
  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
  event.target.classList.add("active");
  displayTasks();
}

// Random Quote
function showQuote() {
  const random = Math.floor(Math.random() * quotes.length);
  quoteBox.textContent = `"${quotes[random]}"`;
}
setInterval(showQuote, 8000);

// Render Calendar
function renderCalendar() {
  const calendar = document.getElementById("calendar");
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();

  const firstDay = new Date(year, now.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();

  let table = `<h3>${month} ${year}</h3><table><tr>`;
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  days.forEach(d => table += `<th>${d}</th>`);
  table += "</tr><tr>";

  for (let i = 0; i < firstDay; i++) table += "<td></td>";

  for (let day = 1; day <= daysInMonth; day++) {
    const today = (day === now.getDate()) ? "today" : "";
    table += `<td class="${today}" onclick="filterByDate('${year}-${String(now.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}')">${day}</td>`;
    if ((day + firstDay) % 7 === 0) table += "</tr><tr>";
  }

  table += "</tr></table>";
  calendar.innerHTML = table;
}

// Filter by Date
function filterByDate(date) {
  currentDateFilter = date;
  displayTasks();
}

// Initial Load
displayTasks();
showQuote();
renderCalendar();

