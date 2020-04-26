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

    fetch(myRequest);
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

function renderTask(result)
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
    localTask.id = urlVars.taskId ?? false;

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
