const taskFormEl = document.getElementById('task-form');
const taskTextInputEl = document.getElementById('task-text-input');

taskFormEl.addEventListener('submit', (event) => {
  event.preventDefault();

  const newTask = { taskContent: taskTextInputEl.value }

  taskTextInputEl.value = '';

  addTask(newTask);
});

// Basic architecture of using service workers:
// 1. register service worker
// 2. install service worker
// 3. activate the installed service worker

const registerServiceWorker = async () => {
  // if-block checks to make sure service workers are supported by browser before trying to register one
  if('serviceWorker' in navigator) {
    try {
      // register service worker for this site
      // (note this is the file's URL relative to the origin, not the JS file that references it.)
      // The scope parameter is optional, and can be used to specify the subset of your content that you want the service worker to control. In this case, we have specified '/', which means all content under the app's origin. If you leave it out, it will default to this value anyway, but we specified it here for illustration purposes
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      if(registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
    } catch (error) {
      console.error(`Registration failed: ${error}`);
    }
  }
}

registerServiceWorker();
openIDB();