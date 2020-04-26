var localTask = {};
var taskChanges = {};

// TODO: remove this sample dataset
var localSubtasks = [
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
];
localSubtasks = [];

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
        .then(renderTask);
});
