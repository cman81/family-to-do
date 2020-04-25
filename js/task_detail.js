var task;

$(function() {
    const updateName = debounce(
        function() {
            task.name = $(this).val();
        },
        250
    );
    $('#task-name').on('keyup', updateName);
});
