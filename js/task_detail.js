var localTask = {};
var taskChanges = {};
var localSubtasks = [];

$(function() {
    $('#task-name').on('keyup', function() {
        if (localTask.name == $(this).val()) {
            delete taskChanges.name;
            return;
        }
        taskChanges.name = $(this).val();
    });
    $('#category').on('keyup', function() {
        taskChanges.category = $(this).val();
    });

    let $dueDate = $('#due-date');
    $dueDate.datetimepicker({
        format: 'L',
        useCurrent: false,
    });
    $dueDate.on('change.datetimepicker', function(event) {
        if (!(event.date._i != $(this).val())) { return; }

        let thisValue = $(this).val();
        if (thisValue.length > 10) {
            thisValue = thisValue.substring(0, 10);
        }

        taskChanges.dateDue = thisValue;

        updateTask(taskChanges);
        taskChanges = { id: taskChanges.id };
    });

    // @see https://stackoverflow.com/q/9435086
    $('#clear-dates').on('click', function(){
        $('#due-date').val('');
        taskChanges.dateDue = "";
        updateTask(taskChanges);
        taskChanges = { id: taskChanges.id };
    });

    $('body').on('click', 'button', function() {
        const operation = $(this).data('operation');
        if (!operation) {
            return;
        }

        if (operation == 'updateTask') {
            updateTask(taskChanges);
            taskChanges = { id: taskChanges.id };
        }

        if (operation == 'addSubtask') {
            addSubtask();
        }
    }).on('click', '.back.icon', function() {
        if (!localBreadcrumb['index.html']) {
            window.location.assign(`index.html?groupId=${localTask.groupId}`);
        }

        const queryParams = $.param(localBreadcrumb['index.html']);
        window.location.assign(`index.html?${queryParams}`);
    });;

    $('.task-note.row').on('click', function() {
        window.location.assign(`task_note.html?taskId=${localTask.id}`);
    });

    $('.main.container').on('click', '.unchecked.icon, .checked.icon', function() {
        // Handler for checking/unchecking subtasks
        const isChecking = $(this).hasClass('unchecked');
        const $container = $(this).parents('.existing-subtask.row');

        const subtaskId = $container.data('subtask-id');
        if ((typeof subtaskId) != "number") {
            // we are trying to check a temporary task - abort
            return;
        }

        // update checkbox client-side
        $(this)
            .toggleClass('checked')
            .toggleClass('unchecked');
        $(this)
            .next()
            .toggleClass('checked')
            .toggleClass('unchecked');

        // update checkbox server-side
        const queryParams = $.param({
            subtaskId: subtaskId,
            isChecking: (isChecking) ? 1: 0
        });
        const myRequest = new Request(`api/complete_subtask.php?${queryParams}`);
        fetch(myRequest);
    }).on('click', '.delete.icon', function() {
        // Handler for deleting subtasks
        const $container = $(this).parents('.existing-subtask.row');
        
        const subtaskId = $container.data('subtask-id');
        if ((typeof subtaskId) != "number") {
            // we are trying to delete a temporary task - abort
            return;
        }

        // delete subtask client-side
        $container.remove();

        // delete checkbox server-side
        const myRequest = new Request(`api/delete_subtask.php?subtaskId=${subtaskId}`);
        fetch(myRequest);
    }).on('change', '.existing-subtask input:text', function() {
        // Handler for renaming subtasks
        const $container = $(this).parents('.existing-subtask.row');
        
        const subtaskId = $container.data('subtask-id');
        if ((typeof subtaskId) != "number") {
            // we are trying to rename a temporary task - abort
            return;
        }

        // rename subtask client-side
        let thisSubtask;
        for (let key in localSubtasks) {
            const value = localSubtasks[key];
            if (value.id != subtaskId) { continue; }

            localSubtasks[key].name = $(this).val();
            thisSubtask = value;
        }

        if (!thisSubtask) { return; }

        // rename subtask server-side
        const myRequest = new Request(
            'api/update_subtask.php',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(thisSubtask)
            }
        );
    
        fetch(myRequest);
    }).on('click', '.respawn .col-auto.icon, .respawn .value .float-left', function() {
        // handler for setting respawn
        window.location.assign(`task_respawn.html?taskId=${localTask.id}`);
    }).on('click', '.respawn .float-right.icon', function() {
        // handler for removing respawn

        // client-side
        localTask.respawn = false;
        taskChanges.respawn = 'never';
        $container = $('.respawn .value');
        $container.addClass('no-respawn');
        $container.find('.float-left').html('Repeat every...?');

        // server-side
        updateTask(taskChanges);
        taskChanges = { id: taskChanges.id };
    }).on('click', '.category.row .float-right.icon', function() {
        // handler for removing category

        // client-side
        $('#category').val('');
        taskChanges.category = '';

        // server-side
        updateTask(taskChanges);
        taskChanges = { id: taskChanges.id };
    });

    loadBreadcrumb();
    loadTask()
        .then(renderTaskDetails)
        .then(loadSubtasks)
        .then(renderSubtasks);
});

function loadSubtasks(response) {
    const myRequest = new Request(`api/load_subtask_list.php?taskId=${localTask.id}`);
    
    return fetch(myRequest)
        .then(response => response.json())
        .then(response => {
            localSubtasks = response;
        });
}

function renderSubtasks(response) {
    for (let key in localSubtasks) {
        const subtask = localSubtasks[key];
        const checkedCssClass = subtask.isComplete ? 'checked' : 'unchecked';

        $('.container.main .row.new-subtask').before(renderSubtask(checkedCssClass, subtask));
    } 
}

function renderSubtask(checkedCssClass, subtask) {
    return `
        <div class="row existing-subtask" data-subtask-id="${subtask.id}">
            <div class="col-auto existing-subtask ${checkedCssClass} icon">
                <!-- hide one of these icons -->
                ${checkedIcon()}
                ${uncheckedIcon()}
            </div>
            <div class="col existing-subtask-value ${checkedCssClass}">
                <span class="float-left">
                    <label for="task-name" class="sr-only">Subtask</label>
                    <input type="text" class="form-control-plaintext" id="subtask-${subtask.id}"
                        value="${subtask.name}" />    
                </span>
                <span class="delete float-right icon">
                    <svg class="bi bi-x" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z" clip-rule="evenodd"/>
                        <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z" clip-rule="evenodd"/>
                    </svg>
                </span>
            </div>
        </div>
    `;
}

function uncheckedIcon() {
    return `
        <svg class="bi bi-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z" clip-rule="evenodd"/>
        </svg>
    `;
}

function checkedIcon() {
    return `
        <svg class="bi bi-check-box" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M15.354 2.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3-3a.5.5 0 11.708-.708L8 9.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M1.5 13A1.5 1.5 0 003 14.5h10a1.5 1.5 0 001.5-1.5V8a.5.5 0 00-1 0v5a.5.5 0 01-.5.5H3a.5.5 0 01-.5-.5V3a.5.5 0 01.5-.5h8a.5.5 0 000-1H3A1.5 1.5 0 001.5 3v10z" clip-rule="evenodd"/>
        </svg>
    `;
}
