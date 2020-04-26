var localTask = {};
var taskChanges = {};

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
    });

    $('.task-note.row').on('click', function() {
        window.location.href = `task_note.html?taskId=${localTask.id}`;
    });

    loadTask()
        .then(renderTask);
});
