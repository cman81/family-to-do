if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

var localTasks = [];
var groupId, groupName;

$(function() {
    $('#actions').on('click', 'button', function() {
        const operation = $(this).data('operation');
        if (!operation) {
            return;
        }

        if (operation == 'addTask') {
            addTask(); 
        }
        if (operation == 'refreshTasks') {
            window.location.href = window.location.href; // @see https://stackoverflow.com/a/7955985
        }
    })

    $('.existing.task')
        .on('change', '.task-checkbox input', function() {
            markComplete($(this).val());
        })
        .on('click', '.task-details', function() {
            window.location.href = `task_detail.html?taskId=${$(this).data('taskId')}`;
        });

    $('.navbar').on('click', '.back-icon', function() {
        window.location.href = `task_groups.html`;
    });

    $('body').on('click', '.back.icon', function() {
        window.history.back();
    });

    const urlVars = getUrlVars();
    if (urlVars.smart) {
        loadSmartList(urlVars);
        return;
    }
    if (!urlVars.groupId) {
        window.location.replace(`task_groups.html`);
    }

    groupId = urlVars.groupId;
    loadGroupMetadata();
    loadTasks();
});

function loadSmartList(urlVars) {
    if (urlVars.smart == 'today') {
        $('.list-title').html('Today');

        $('.new.task.container').remove();
        $('#actions .add-task').remove();

        const queryParams = $.param({
            userId: urlVars.userId,
        });
        const myRequest = new Request(`api/load_tasks_today.php?${queryParams}`);
        fetch(myRequest)
            .then(response => response.json())
            .then(response => {
                localTasks = response;
                renderTaskList();
            });
    }    
}

function addTask() {
    $addTask = document.getElementById('add-task');
    const taskName = $addTask.value;
    $addTask.value = '';

    const tempId = generateTempId();
    const newTask = {
        id: tempId,
        name: taskName,
        tempId: tempId,
        groupId: groupId,
    };

    // insert task client-side
    insertTaskClientSide(newTask);

    // insert task server-side
    const myRequest = new Request('api/add_task.php', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
    });
    fetch(myRequest)
        .then(response => response.json())
        .then(response => {
            reidentifyTask(response.tempId, response.id);
            updateTempTask(response, localTasks);
        });
}

function loadGroupMetadata() {
    const myRequest = new Request(`api/load_task_group.php?groupId=${groupId}`);

    fetch(myRequest)
        .then(response => response.json())
        .then(response => {
            groupName = response.name;
            $('.list-title').html(groupName);        
        });
}

function insertTaskClientSide(newTask) {
    localTasks.unshift(newTask);
    const $container = $('.container.existing.task');
    $container.prepend(renderTask(newTask));
}

function playSound(cssId) {
    const sound = $(cssId)[0];
    if (!sound) {
        return;
    }

    sound.currentTime = 0;
    sound.play();
}

function markComplete(taskId) {
    // mark complete client-side
    document.getElementById(`task-${taskId}`).remove();
    playSound('#low-conga');

    if (taskId.match('temp')) {
        taskId = tempIdMap[taskId] || false;
    }

    if (!taskId) { return; }

    // mark complete server-side
    const thisTask = getLocalTask(taskId);

    const queryParams = $.param({
        taskId: taskId,
        dateDue: thisTask.dateTimestamp,
        respawn: thisTask.respawn,
    });
    const myRequest = new Request(`api/complete_task.php?${queryParams}`);
    fetch(myRequest)
        .then(response => response.json())
        .then(response => {
            insertTaskClientSide(response);
        });
}

function getLocalTask(taskId) {
    const matchingTasks = localTasks.filter(task => task.id == taskId);
    if (!matchingTasks) {
        return {};
    }

    return matchingTasks[0];
}

function loadTasks() {
    const myRequest = new Request(`api/load_tasks.php?groupId=${groupId}`);
    fetch(myRequest)
        .then(response => response.json())
        .then(response => {
            localTasks = response;
            renderTaskList();
        });
}

function actionHandler(event) {
    const operation = event.currentTarget.getAttribute('data-operation');

    if (operation == 'addTask') {}
}

function renderTaskList() {
    for (let key in localTasks) {
        const task = localTasks[key];

        const $container = $('.container.existing.task');
        $container.append(renderTask(task));
    }
}

function renderTask(task) {
    const $newDiv = $(`
        <div class="row" id="task-${task.id}">
            <div class="col">
            <form class="form-inline">
                <div class="form-group task-checkbox">
                    <input class="form-check-input position-static" type="checkbox" value="${task.id}" aria-label="..." />
                </div>
                <div class="form-group task-details ${task.dateDue ? '' : 'no-due'}" data-task-id="${task.id}">
                    <div class="task-name">${task.name}</div>
                </div>
                <div class="form-group task-icons float-right">
                    ${task.isMore ? pencilSquareIcon() : ''}
                </div>
            </form>
            </div>
        </div>
    `);

    if (!task.dateDue) { return $newDiv; }

    const yesterday = Date.now() - (1000 * 60 * 60 * 24);
    const overdueClass = (yesterday / 1000 > task.dateTimestamp) ? 'overdue' : '';
    $newDiv.find('.task-details').append(`
        <div class="task-due ${overdueClass}">
            <small>${task.dateDue}</small>
        </div>
    `);

    return $newDiv;
}

function pencilSquareIcon() {
    return `
        <svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.502 1.94a.5.5 0 010 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 01.707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 00-.121.196l-.805 2.414a.25.25 0 00.316.316l2.414-.805a.5.5 0 00.196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-6a.5.5 0 00-1 0v6a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5H9a.5.5 0 000-1H2.5A1.5 1.5 0 001 2.5v11z" clip-rule="evenodd"/>
        </svg>
    `;
}
