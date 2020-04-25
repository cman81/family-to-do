var localTask;

$(function() {
    const updateName = debounce(
        function() {
            localTask.name = $(this).val();
        },
        250
    );
    $('#task-name').on('keyup', updateName);

    loadTask(taskId);
});

function loadTask(taskId) {
    const myRequest = new Request(`api/load_task.php?task_id=${parseInt(taskId)}`);
    fetch(myRequest)
        .then(response => response.json())
        .then(response => {
            localTask = response;
        });
}
