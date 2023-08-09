const taskFormEl = document.getElementById('task-form');
const taskTextInputEl = document.getElementById('task-text-input');

taskFormEl.addEventListener('submit', (event) => {
  event.preventDefault();

  const newTask = { taskContent: taskTextInputEl.value }

  taskTextInputEl.value = '';

  addTask(newTask);
});


openIDB();