# Kanban

## To Do
- Pass around a breadcrumb so that the back button on Task Details can go back to the proper Task List (e.g.: Smart List)
- Reorder lists somehow
- Add a group
- Fix task name container height so that characters like "g" and "y" are not cutoff
- Handle longer task names, e.g.: "Wash towels (bathroom, basement, and power room) - midweek"
- Handle timezone difference
- Move a task to another list
- Prevent empty tasks and subtasks from being created
- Delete a task
- Clone a task
- Delete a group
- Make URLs clickable in task notes
- Fix bug: When checking a task that does not repeat, a new 'undefined' task appears client-side
- Allow for tasks to contain file uploads
- Swipe to delete

## Doing
- Pass a breadcrumb around so that 'back' button goes to the proper list / user 

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
- Repeating tasks
- Fix bug: when editing a task note, console says "renderTask is not defined"
- Fix bug: when adding a subtask, console says "renderTask is not defined"
- Show an "extra" icon in the task list when details/subtasks exist
- Create a page of group lists
- Fix bug: The first subtask does not immediately show after creating it 
- Have user profiles
- Allow/restrict list access, e.g.: shared, private
- In the task list, derive group name from the database instead of URL query parameters
- Make "Today" smart list
- On the task list, indicate which tasks are repeating
- Add a refresh button to the task list
- Rework current lists to have 1 default category. Put all tasks in that category
- Render a task category
- Allow for a task group to be categorized, e.g.: Groceries => Harris Teeter, Aldi, H-Mart
- Add a task to a category
- Fix bug: when going to task respawn or task note, we can't get back to our task list!
- Fix bug: checked off tasks reappear when refreshing the task list
- Add "Next 7 Days" smart list, categorized by day
- Show tasks with no due date at the top of task lists
