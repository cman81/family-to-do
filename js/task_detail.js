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

    $('#due-date').on('change', function() {
        if (localTask.dateDue == $(this).val()) {
            delete taskChanges.dateDue;
            return;
        }
        taskChanges.dateDue = $(this).val();
    });

    $('body').on('click', 'button', function() {
        const operation = $(this).data('operation');
        if (!operation) {
            return;
        }

        if (operation == 'updateTask') {
            updateTask();
        }

        if (operation == 'addSubtask') {
            addSubtask();
        }
    });

    $('.task-note.row').on('click', function() {
        window.location.href = `task_note.html?taskId=${localTask.id}`;
    });

    loadTask()
        .then(renderTask)
        .then(loadSubtasks)
        .then(renderSubtasks);
});

function loadSubtasks(response) {
    // TODO: load this from the database
    localSubtasks = [
        {
            name: 'Boil water',
        },
        {
            name: 'Prep ingredients',
            isComplete: true
        },
        {
            name: 'Cook!',
        },
    ]
}

function renderSubtasks(response) {
    for (let key in localSubtasks) {
        const subtask = localSubtasks[key];
        const checkedCssClass = subtask.isComplete ? 'checked' : 'unchecked';
        const whichCheckboxIcon = subtask.isComplete ? checkedIcon() : uncheckedIcon();

        $('.container.main .row.new-subtask').before(`
            <div class="row existing-subtasks">
                <div class="col-auto new-subtask ${checkedCssClass} icon">
                    ${whichCheckboxIcon}
                </div>
                <div class="col existing-subtask-value ${checkedCssClass}">
                    <span class="float-left">
                        <label for="task-name" class="sr-only">Subtask</label>
                        <input type="text" class="form-control-plaintext" id="subtask-${key}"
                            value="${subtask.name}" />    
                    </span>
                    <span class="actions float-right icon">
                        <svg class="bi bi-x" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 010 .708l-7 7a.5.5 0 01-.708-.708l7-7a.5.5 0 01.708 0z" clip-rule="evenodd"/>
                            <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 000 .708l7 7a.5.5 0 00.708-.708l-7-7a.5.5 0 00-.708 0z" clip-rule="evenodd"/>
                        </svg>
                    </span>
                </div>
            </div>
        `);
    } 
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
