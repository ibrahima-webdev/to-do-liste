// Sélection des éléments
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const deadlineInput = document.getElementById('deadline');
const categoryInput = document.getElementById('category');
const priorityInput = document.getElementById('priority');
const searchInput = document.getElementById('search');
const sortByDateButton = document.getElementById('sort-by-date'); // Bouton Trier par Dates
const sortByPriorityButton = document.getElementById('sort-by-priority'); // Bouton Trier par Priorité

// Fonction d'ajout de tâche
function addTask() {
    const taskText = taskInput.value.trim();
    const deadline = deadlineInput.value;
    const category = categoryInput.value;
    const priority = priorityInput.value;

    if (taskText === '') {
        alert('Veuillez entrer une tâche !');
        return;
    }

    // Créer l'élément de la tâche
    const taskItem = document.createElement('li');
    taskItem.className = 'task priority-' + priority;

    const taskContent = document.createElement('span');
    taskContent.className = 'task-content';
    taskContent.innerHTML = `<strong>${taskText}</strong><br>Date limite: ${deadline}<br>Catégorie: ${category}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-btn';
    deleteButton.onclick = () => {
        taskItem.remove();
        saveTasks();
    };

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Terminer';
    completeButton.className = 'complete-btn';
    completeButton.onclick = () => {
        taskContent.classList.toggle('complete');
        saveTasks();
    };

    const setHourButton = document.createElement('button');
    setHourButton.textContent = 'Ajouter une heure';
    setHourButton.className = 'hour-btn';
    setHourButton.onclick = () => {
        const hour = prompt('Entrez l\'heure pour cette tâche (HH:MM):');
        if (hour) {
            taskContent.innerHTML += `<br>Heure: ${hour}`;
            saveTasks();
        }
    };

    // Ajouter les éléments
    taskItem.appendChild(taskContent);
    taskItem.appendChild(deleteButton);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(setHourButton);
    taskList.appendChild(taskItem);

    // Ajouter l'animation
    setTimeout(() => taskItem.classList.add('added'), 10);

    // Sauvegarder les tâches
    saveTasks();

    // Effacer l'entrée
    taskInput.value = '';
    deadlineInput.value = '';
    categoryInput.value = 'travail';
    priorityInput.value = 'basse';
}

// Sauvegarder les tâches
function saveTasks() {
    let tasks = [];
    document.querySelectorAll('#task-list li').forEach(item => {
        let task = {
            name: item.querySelector('.task-content strong').textContent,
            deadline: item.querySelector('.task-content').childNodes[1].textContent.split(': ')[1],
            category: item.querySelector('.task-content').childNodes[3].textContent.split(': ')[1],
            priority: item.classList[1].split('-')[1],
            hour: item.querySelector('.task-content').innerHTML.includes('Heure:')
                ? item.querySelector('.task-content').innerHTML.split('Heure: ')[1].split('<')[0]
                : ''
        };
        tasks.push(task);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Charger les tâches
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task priority-' + task.priority;

            const taskContent = document.createElement('span');
            taskContent.className = 'task-content';
            taskContent.innerHTML = `<strong>${task.name}</strong><br>Date limite: ${task.deadline}<br>Catégorie: ${task.category}`;
            if (task.hour) {
                taskContent.innerHTML += `<br>Heure: ${task.hour}`;
            }

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-btn';
            deleteButton.onclick = () => {
                taskItem.remove();
                saveTasks();
            };

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Terminer';
            completeButton.className = 'complete-btn';
            completeButton.onclick = () => {
                taskContent.classList.toggle('complete');
                saveTasks();
            };

            const setHourButton = document.createElement('button');
            setHourButton.textContent = 'Ajouter une heure';
            setHourButton.className = 'hour-btn';
            setHourButton.onclick = () => {
                const hour = prompt('Entrez l\'heure pour cette tâche (HH:MM):');
                if (hour) {
                    taskContent.innerHTML += `<br>Heure: ${hour}`;
                    saveTasks();
                }
            };

            taskItem.appendChild(taskContent);
            taskItem.appendChild(deleteButton);
            taskItem.appendChild(completeButton);
            taskItem.appendChild(setHourButton);
            taskList.appendChild(taskItem);

            setTimeout(() => taskItem.classList.add('added'), 10);
        });
    }
}

// Fonction de tri des tâches
function sortTasks(criteria) {
    let sortedTasks = Array.from(document.querySelectorAll('#task-list li'))
        .sort((a, b) => {
            let valueA = a.querySelector('.task-content')
                .childNodes[criteria === 'deadline' ? 1 : 3]
                .textContent.split(': ')[1];
            let valueB = b.querySelector('.task-content')
                .childNodes[criteria === 'deadline' ? 1 : 3]
                .textContent.split(': ')[1];

            if (criteria === 'priority') {
                return ['basse', 'moyenne', 'haute']
                    .indexOf(valueA) - ['basse', 'moyenne', 'haute']
                    .indexOf(valueB);
            } else {
                return new Date(valueA) - new Date(valueB);
            }
        });
    taskList.innerHTML = '';
    sortedTasks.forEach(task => taskList.appendChild(task));
}

// Écouteurs d'événements
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});
searchInput.addEventListener('input', filterTasks);
sortByDateButton.addEventListener('click', () => sortTasks('deadline')); // Gestionnaire pour Trier par Dates
sortByPriorityButton.addEventListener('click', () => sortTasks('priority')); // Gestionnaire pour Trier par Priorité

// Charger les tâches au démarrage
window.onload = loadTasks;