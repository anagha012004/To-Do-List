window.addEventListener('load', () => {
    const form = document.querySelector('#new-task-form');
    const input = document.querySelector('#new-task-input');
    const list_el = document.querySelector('#tasks');

    // Function to retrieve tasks from local storage
    function getTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        return tasks;
    }

    // Function to save tasks to local storage
    function saveTasksToLocalStorage(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to add a new task
    function addTask(taskText) {
        const task = {
            text: taskText
        };
        const tasks = getTasksFromLocalStorage();
        tasks.push(task);
        saveTasksToLocalStorage(tasks);
    }

    // Function to display tasks
    function displayTasks() {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach(task => {
            const task_el = createTaskElement(task.text);
            list_el.appendChild(task_el);
        });
    }

    // Function to update a task in local storage by its index
    function updateTaskInLocalStorage(index, updatedText) {
        const tasks = getTasksFromLocalStorage();
        tasks[index].text = updatedText;
        saveTasksToLocalStorage(tasks);
    }

    // Function to delete a task from local storage by its index
    function deleteTaskFromLocalStorage(index) {
        const tasks = getTasksFromLocalStorage();
        tasks.splice(index, 1);
        saveTasksToLocalStorage(tasks);
    }

    // Function to create a task element
    function createTaskElement(taskText) {
        const task_el = document.createElement('div');
        task_el.classList.add('task');

        const content_el = document.createElement('div');
        content_el.classList.add('content');

        task_el.appendChild(content_el);

        const input_el = document.createElement('input');
        input_el.classList.add('text');
        input_el.type = 'text';
        input_el.value = taskText;
        input_el.setAttribute('readonly', 'readonly');

        content_el.appendChild(input_el);

        const actions_el = document.createElement('div');
        actions_el.classList.add('actions');

        const edit_el = document.createElement('button');
        edit_el.classList.add('edit');
        edit_el.innerText = 'Edit';

        const delete_el = document.createElement('button');
        delete_el.classList.add('delete');
        delete_el.innerText = 'Delete';

        actions_el.appendChild(edit_el);
        actions_el.appendChild(delete_el);

        task_el.appendChild(actions_el);

        // Add event listeners for edit and delete here...
        return task_el;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = input.value;
        addTask(taskText);
        const task_el = createTaskElement(taskText);
        list_el.appendChild(task_el);
        input.value = '';
    });

    // Add event listeners for edit and delete buttons
    list_el.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('edit')) {
            const task_el = e.target.closest('.task');
            const input_el = task_el.querySelector('.text');

            if (e.target.innerText.toLowerCase() === 'edit') {
                e.target.innerText = 'Save';
                input_el.removeAttribute("readonly");
                input_el.focus();
            } else {
                e.target.innerText = 'Edit';
                input_el.setAttribute("readonly", "readonly");

                // Update the task text in local storage
                const index = Array.from(list_el.children).indexOf(task_el);
                updateTaskInLocalStorage(index, input_el.value);
            }
        } else if (e.target && e.target.classList.contains('delete')) {
            const task_el = e.target.closest('.task');

            // Delete the task from the list
            list_el.removeChild(task_el);

            // Delete the task from local storage
            const index = Array.from(list_el.children).indexOf(task_el);
            deleteTaskFromLocalStorage(index);
        }
    });

    // Display tasks from local storage when the page loads
    displayTasks();
});
