const taskListEl = document.getElementById("task-list");

// **********
// the value of taskSeedData will come from IndexedDB after I figure out how to make that happen
// ********** 
const taskSeedData = [
  {id: 1, taskContent: "TASK 1"},
  {id: 2, taskContent: "TASK 2"},
  {id: 3, taskContent: "TASK 3"},
];

// IndexedDB Basic Pattern:
// 1) Open a database.
// 2) Create an object store in the database.
// 3) Start a transaction and make a request to do some database operation, like adding or retrieving data.
// 4) Wait for the operation to complete by listening to the right kind of DOM event.
// 5) Do something with the results (which can be found on the request object).

let db;
// Open da database
const IDBrequest = window.indexedDB.open('TaskDB', 1);

IDBrequest.onerror = e => {
  console.error(`IDB database error: ${e.target.errorCode}`);
}

IDBrequest.onsuccess = e => {
  db = e.target.result;
}


const renderSeedData = () => {
  taskSeedData.forEach(currentTask => {
    const liEl = document.createElement("li");
  
    liEl.innerHTML = `
    <div class="field">
      <div class="control has-icons-right">
        <label class="checkbox is-size-4">
          <input class="mr-3" type="checkbox" />
          ${currentTask.taskContent}
        </label>
  
        <span class="icon is-right">
          <ion-icon name="trash-outline"></ion-icon>
        </span>
      </div>
    </div>
    `;
  
    taskListEl.appendChild(liEl);
  });
}

renderSeedData();