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

const getAllTasks = (db) => {
  return (request = db
    .transaction('taskStore', 'readonly')
    .objectStore('taskStore')
    .getAll());
};

const renderData = (req) => {
  req.onsuccess = (event) => {
    const db = event.target.result;

    db.forEach((currentTask) => {
      const liEl = document.createElement('li');

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
  };

  req.onerror = (err) => {
    console.error(`Error getting all task data: ${err}`);
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
    dbConnection = event.target.result;

    console.info('Successful database connection');

    renderData(getAllTasks(dbConnection));
  };
};

const testTransaction = () => {
  // open database connection
  const taskDbRequest = window.indexedDB.open('TaskDB', 1);

  taskDbRequest.onerror = () => {
    console.error('Error loading database');
  };

  taskDbRequest.onsuccess = (event) => {
    const db = event.target.result;

    // Start a transaction and make a request to do some database operation, like adding or retrieving data.
    const req = db.transaction('taskStore', 'readonly').objectStore('taskStore').getAll();

    // Wait for the operation to complete by listening to the right kind of DOM event.
    req.onsuccess = (event) => {
      // Do something with the results (which can be found on the request object)
      console.log(event.target.result);
    }
  }
}