var localTask = {};
var taskChanges = {};

$(function() {
    loadTask()
        .then(setupBackButton);
});

function setupBackButton(result) {
    $('.back.icon').on('click', function() {
        window.location.href = `task_detail.html?taskId=${localTask.id}`;
    })
}
