# Kanban

## To Do
- Allow/restrict list access, e.g.: shared, private
- In the task list, derive group name from the database instead of URL query parameters
- Allow for tasks to contain file uploads
- Add a refresh button to the task list
- Add a group
- Fix task name container height so that characters like "g" and "y" are not cutoff
- Handle longer task names, e.g.: "Wash towels (bathroom, basement, and power room) - midweek"
- Move a task to another list
- Prevent empty tasks and subtasks from being created
- Delete a task
- Clone a task
- Delete a group
- Make URLs clickable in task notes
- Allow for a task group to be subgrouped, e.g.: Groceries => Harris Teeter, Aldi, H-Mart

## Doing
- Have user profiles

## Done
- Render a list of incomplete tasks with: name, due date (as necessary), more details (as necessary)
- Retrieve tasks from the DB
- Add a task to a task list
- Mark a task as complete
- View task details: name, due date, notes
- Edit task details
- Add subtasks
- Delete a subtask
- Rename a subtask
- Save due date to the DB on 'change' event
- Reidentify newly created tasks after they are assigned an ID
- Fix bug where "Jan 1" is showing on the task list instead of the actual Due Date
- Respawn task details
- Respawn subtasks
- Recurring tasks
- Fix bug: when editing a task note, console says "renderTask is not defined"
- Fix bug: when adding a subtask, console says "renderTask is not defined"
- Show an "extra" icon in the task list when details/subtasks exist
- Create a page of group lists
- Fix bug: The first subtask does not immediately show after creating it 
