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
            breadcrumbAndGo(`task_detail.html?taskId=${$(this).data('taskId')}`);
        });

    $('.navbar').on('click', '.back-icon', function() {
        if (!localBreadcrumb['task_groups.html']) {
            window.location.assign(`task_groups.html`);
        }

        window.location.assign(`task_groups.html?userId=${localBreadcrumb['task_groups.html'].userId}`);
    });

    loadBreadcrumb();

    const urlVars = getUrlVars();
    if (urlVars.smart) {
        loadSmartList(urlVars);
        return;
    }
    if (!urlVars.groupId) {
        window.location.replace(`task_groups.html`);

        // TODO: make task_groups.html the homepage, rename index.html to tasks.html
    }

    groupId = urlVars.groupId;
    loadGroupMetadata();
    loadTasks();
    makeItemsSortable();
});

/**
 * @see https://github.com/Shopify/draggable/tree/master/src/Sortable
 */
function makeItemsSortable() {
    // @see https://github.com/Shopify/draggable/issues/295#issuecomment-448518952
    const sortable = new Sortable.default(document.querySelectorAll('.existing.task.container'), {
        draggable: '.existing.task .row:not(.category)'
    });
    
    sortable.on('sortable:stop', (event) => {
        const $targetElement = $(event.data.dragEvent.data.source);

        // update the category we are in
        const taskId = $targetElement.find('.task-details').data('taskId');
        const oldCategory = getTaskCategory(taskId);
        const newCategory = $targetElement.prevAll().filter('.category').first().text().trim();

        if (oldCategory != newCategory) {
            updateTaskCategory(taskId, newCategory, oldCategory);
        }

        // update the weights of all items in the list
        let taskOrder = [];
        const $taskDetails = $('.task-details');
        $taskDetails.each(function(idx) {
            if ($(this).parents('.row').hasClass('draggable--original')) {
                return;
            }
            if ($(this).parents('.row').hasClass('draggable-mirror')) {
                return;
            }

            const key = $(this).data('task-id');
            taskOrder.push(key);
        });

        updateTaskOrder(taskOrder);
    });
}

function updateTaskCategory(taskId, newCategory, oldCategory) {
    // client-side
    for (let key in localTasks[oldCategory]) {
        const value = localTasks[oldCategory][key];

        if (value.id != taskId) { continue; }
        
        localTasks[newCategory].push(value);
        break;
    }
    localTasks[oldCategory] = localTasks[oldCategory].filter(item => item.id != taskId);

    // server-side
    let taskChanges = {};
    taskChanges.id = taskId;
    taskChanges.category = newCategory;
    updateTask(taskChanges);
}

function updateTaskOrder(taskOrder) {
    const myRequest = new Request(
        'api/update_task_order.php',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                taskOrder: taskOrder,
                groupId: groupId,
            })
        }
    );

    return fetch(myRequest);
}

function getTaskCategory(taskId) {
    for (let key in localTasks) {
        const value = localTasks[key];

        const filteredArray = value.filter(item => item.id == taskId);
        if (filteredArray.length) {
            return key;
        }
    }

    return '';
}

function loadSmartList(urlVars) {
    let apiEndpoint;
    if (urlVars.smart == 'today') {
        $('.list-title').html('Today');
        apiEndpoint = 'api/load_tasks_today.php';
    }

    if (urlVars.smart == 'next7days') {
        $('.list-title').html('Next 7 Days');
        apiEndpoint = 'api/load_tasks_7day.php';
    }

    if (!apiEndpoint) { return; }

    $('.new.task.container').remove();
    $('#actions .add-task').remove();

    const queryParams = $.param({
        userId: urlVars.userId,
    });
    const myRequest = new Request(`${apiEndpoint}?${queryParams}`);
    fetch(myRequest)
        .then(response => response.json())
        .then(response => {
            localTasks = response;
            renderTaskList();
        });
}

function addTask() {
    let $addTask = document.getElementById('add-task');
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
const category = 'default category';

    if (!localTasks[category]) {
        localTasks[category] = [];
        $('.existing.task.container').append(renderCategoryHeader(category));
    }

    localTasks[category].unshift(newTask);

    $('.category.row').each(function() {
        if ($(this).data('category') == category) {
            $(this).after(renderTask(newTask));
            return false;
        }
    });
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
    let flattenedTasks = [];
    for (let category in localTasks) {
        const categoryTasks = localTasks[category];
        for (let key in categoryTasks) {
            flattenedTasks.push(categoryTasks[key]);
        }
    }

    const matchingTasks = flattenedTasks.filter(task => task.id == taskId);
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
    const $container = $('.container.existing.task');

    for (let category in localTasks) {
        const categoryTasks = localTasks[category];
        $container.append(renderCategoryHeader(category));

        for (let key in categoryTasks) {
            const task = categoryTasks[key];
    
            $container.append(renderTask(task));
        }
    }

    if (Object.keys(localTasks)[0] == 'default category') {
        $('.category.row').hide();
    }
}

function renderCategoryHeader(category) {
    const $newDiv = $(`
        <div class="row category">
            <div class="col"><small>${category}</small></div>
        </div>
    `);
    $newDiv.data('category', category);

    return $newDiv;
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

    const yesterday = Math.floor((Date.now() - (1000 * 60 * 60 * 24)) / 1000) - (new Date().getTimezoneOffset() * 60);
    const overdueClass = (yesterday > task.dateTimestamp) ? 'overdue' : '';
    $newDiv.find('.task-details').append(`
        <div class="task-due ${overdueClass}">
            <small>${task.dateDue} ${task.respawn ? repeatingIcon() : ''}</small>
        </div>
    `);

    return $newDiv;
}

function repeatingIcon() {
    return `
        <svg class="bi bi-arrow-repeat" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M2.854 7.146a.5.5 0 00-.708 0l-2 2a.5.5 0 10.708.708L2.5 8.207l1.646 1.647a.5.5 0 00.708-.708l-2-2zm13-1a.5.5 0 00-.708 0L13.5 7.793l-1.646-1.647a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 000-.708z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M8 3a4.995 4.995 0 00-4.192 2.273.5.5 0 01-.837-.546A6 6 0 0114 8a.5.5 0 01-1.001 0 5 5 0 00-5-5zM2.5 7.5A.5.5 0 013 8a5 5 0 009.192 2.727.5.5 0 11.837.546A6 6 0 012 8a.5.5 0 01.501-.5z" clip-rule="evenodd"/>
        </svg>
    `;
}

function pencilSquareIcon() {
    return `
        <svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.502 1.94a.5.5 0 010 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 01.707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 00-.121.196l-.805 2.414a.25.25 0 00.316.316l2.414-.805a.5.5 0 00.196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-6a.5.5 0 00-1 0v6a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5H9a.5.5 0 000-1H2.5A1.5 1.5 0 001 2.5v11z" clip-rule="evenodd"/>
        </svg>
    `;
}
