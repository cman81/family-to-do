var tempIdMap = {};

function updateTask() {
    const myRequest = new Request(
        'api/update_task.php',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskChanges)
        }
    );

    return fetch(myRequest);
}

/**
 * @see https://stackoverflow.com/a/4656873
 */
function getUrlVars()
{
    let vars = [];
    let hash;
    const hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    
    for(let i in hashes) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }

    return vars;
}

function renderTaskDetails(result)
{
    $('#task-name').val(localTask.name);
    if (localTask.dateDue) {
        $('#due-date').val(localTask.dateDue);
    }
    if (localTask.taskNote) {
        $('.task-note.value').html(localTask.taskNote);
    }
}

function loadTask() {
    let urlVars = getUrlVars();
    if (!urlVars.taskId) {
        return new Promise((resolve, reject) => {
            throw 'No taskId parameter has been set';
        });
    }
    localTask.id = urlVars.taskId || false;

    const myRequest = new Request(`api/load_task.php?taskId=${parseInt(localTask.id)}`);
    return fetch(myRequest)
        .then(response => response.json())
        .then(response => {
            if (!response) {
                throw "No task found from the DB";
            }
            localTask = response;
            taskChanges.id = response.id;
        });
}

/**
 * @see https://stackoverflow.com/a/32649933
 */
function generateTempId() {
    return 'temp-' + (+new Date).toString(36);
}

function addSubtask() {
    $addTask = document.getElementById('new-subtask');
    const subtaskName = $addTask.value;
    $addTask.value = '';

    const tempId = generateTempId();
    const newSubtask = {
        id: tempId,
        name: subtaskName,
        tempId: tempId,
    };

    // insert task client-side
    localSubtasks.unshift(newSubtask);
    const $container = $('.existing-subtask.row').last();
    $container.after(renderSubtask('unchecked', newSubtask, newSubtask.id));

    // insert task server-side
    const myRequest = new Request(
        'api/add_subtask.php',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...newSubtask,
                parentTask: localTask.id,
            })
        }
    );
    fetch(myRequest)
        .then(response => response.json())
        .then(response => {
            reidentifySubtask(response.tempId, response.id);
            updateTempTask(response, localSubtasks);
        }); 
}

/**
 * Associate a newly created task with the id that we get from the database.
 */
function updateTempTask(response, collection) {
    for (let key in collection) {
        const value = collection[key];

        if (!value.tempId) { continue; }
        if (value.tempId != response.tempId) { continue; }

        collection[key].id = response.id;
        delete collection[key].tempId;

        tempIdMap[response.tempId] = response.id;
        break;
    }
}

function reidentifySubtask(oldId, newId) {
    // handle the text input
    $target = $(`#subtask-${oldId}`);
    $target.attr('id', `subtask-${newId}`);

    // handle the container
    $target
        .parents('.existing-subtask.row')
        .attr('data-subtask-id', newId);
}

function reidentifyTask(oldId, newId) {
    // handle the container
    $target = $(`#task-${oldId}`);
    $target.attr('id', `task-${newId}`);

    // handle the text input
    $target
        .find('.task-details')
        .attr('data-task-id', newId);
}
