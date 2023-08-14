const taskListEl = document.getElementById('task-list');
let dbConnection;

const addTaskSeedData = (db) => {
  const tasksObjectStore = db
    .transaction('taskStore', 'readwrite')
    .objectStore('taskStore');

  tasksSeedData.forEach((task) => {
    const req = tasksObjectStore.add(task);

    req.onsuccess = () => {
      console.log(
        `${JSON.stringify(
          task,
          null,
          1
        )} added to tasksObjectStore successfully`
      );
    };
  });
};

const addDeleteEvents = () => {
  const deleteBtnEls = document.querySelectorAll('.delete-btn');

  deleteBtnEls.forEach((deleteBtn) => {
    deleteBtn.addEventListener('click', (event) => {
      const taskToDelete = event.target.closest('li').dataset.taskId;

      deleteTask(taskToDelete);
    });
  });
};

const getAllTasks = (db) => {
  return (request = db
    .transaction('taskStore', 'readonly')
    .objectStore('taskStore')
    .getAll());
};

const renderData = (req) => {
  req.onsuccess = (event) => {
    const db = event.target.result;

    // clear whatever's currently in the taskListEl
    taskListEl.textContent = '';

    db.forEach((currentTask) => {
      const liEl = document.createElement('li');
      liEl.setAttribute('data-task-id', currentTask.id);

      liEl.innerHTML = `
    <div class="field">
      <div class="control task-container">
        <label class="checkbox is-size-4">
          <input class="mr-3" type="checkbox" />
            <span>${currentTask.taskContent}</span>
        </label>
  
        <span class="material-icons delete-btn red">
          delete_forever
        </span>
      </div>
    </div>
    `;

      taskListEl.appendChild(liEl);
    });

    // Because I'm creating all the delete buttons using .innerHTML, wait for the buttons to finish getting created/loaded to page
    // AND THEN grab each delete button and attach event listener
    // (this process can probably be made more efficient by attaching event listener at time of creation, but then I wouldn't be able to use .innerHTML. I'd have to manually create each node and populate each node with content)
    addDeleteEvents();
  };

  req.onerror = (err) => {
    console.error(`Error getting all task data: ${err}`);
  };
};

const addTask = (newTask) => {
  // open database connection
  const taskDbRequest = window.indexedDB.open('TaskDB', 1);

  taskDbRequest.onerror = () => {
    console.error('Error loading database');
  };

  taskDbRequest.onsuccess = (event) => {
    const db = event.target.result;

    // Start a transaction and make a request to do some database operation, like adding or retrieving data.
    const taskObjectStore = db
      .transaction('taskStore', 'readwrite')
      .objectStore('taskStore');

    // Wait for the operation to complete by listening to the right kind of DOM event.
    // Do something with the results (which can be found on the request object)
    const req = taskObjectStore.add(newTask);

    req.onsuccess = () => {
      console.log(
        `${JSON.stringify(
          newTask,
          null,
          1
        )} added to tasksObjectStore successfully`
      );

      renderData(getAllTasks(db));
    };
  };
};

const deleteTask = (taskId) => {
  const taskDbRequest = window.indexedDB.open('TaskDB', 1);

  taskDbRequest.onerror = () => {
    console.error('Error loading database');
  };

  taskDbRequest.onsuccess = (event) => {
    const db = event.target.result;
    const taskObjectStore = db
      .transaction('taskStore', 'readwrite')
      .objectStore('taskStore');

    const req = taskObjectStore.delete(Number(taskId));

    req.onsuccess = () => {
      console.log(`Task with matching ID: ${taskId} deleted successfully`);

      renderData(getAllTasks(db));
    };
  };
};

const openIDB = () => {
  // IndexedDB Basic Pattern:
  // 1) Open a database.
  // 2) Create an object store in the database.
  // 3) Start a transaction and make a request to do some database operation, like adding or retrieving data.
  // 4) Wait for the operation to complete by listening to the right kind of DOM event.
  // 5) Do something with the results (which can be found on the request object).

  // Open the database
  // If the database doesn't already exist, it is created by the open operation, then an onupgradeneeded event is triggered and you create the database schema in the handler for this event. If the database does exist but you are specifying an upgraded version number, an onupgradeneeded event is triggered straight away, allowing you to provide an updated schema in its handler
  const taskDbRequest = window.indexedDB.open('TaskDB', 1);

  // error handling when trying to open connection to database
  taskDbRequest.onerror = () => {
    console.error('Error loading database');
  };

  taskDbRequest.onupgradeneeded = (event) => {
    // Save the IDBDatabase interface
    // In other words, stores the specific database we're targeting (in this case, the "TaskDB" database)
    const db = event.target.result;

    db.onerror = (event) => {
      console.error(`Database error: ${event.target.errorCode}`);
    };

    // first time opening this DB OR a new version was passed into open()
    let oldVersion = event.oldVersion;
    let newVersion = event.newVersion || db.version;
    console.log(`DB updated from version ${oldVersion} to ${newVersion}`);

    // if TaskDB object store already exists, delete it and create new one
    if (db.objectStoreNames.contains('tasks')) {
      db.deleteObjectStore('tasks');
    }

    // Create an object store in the database
    const objectStore = db.createObjectStore('taskStore', {
      keyPath: 'id',
      autoIncrement: true,
    });

    // data indexes will allow me to sort the data in the object store
    objectStore.createIndex('taskContentIDX', 'taskContent', {
      unique: false,
    });

    // add task seed data to object store
    // Use transaction oncomplete to make sure the objectStore creation is finished before adding data into it.
    objectStore.transaction.oncomplete = () => {
      addTaskSeedData(db);
    };
  };

  taskDbRequest.onsuccess = (event) => {
    const db = event.target.result;

    console.info('Successful IDB database connection');

    renderData(getAllTasks(db));
  };
};