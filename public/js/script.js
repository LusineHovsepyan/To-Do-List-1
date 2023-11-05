
    function editTask(button) {
    const index = button.getAttribute("data-index");
    const taskElement = button.parentElement.parentElement.querySelector(".text");
    const currentTask = taskElement.textContent;
    const newTask = prompt('Edit task:', currentTask);
    if (newTask !== null) {
        fetch('/editTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ index: index, updatedTask: newTask }),
        })
        .then(response => {
            if (response.status === 200) {
                taskElement.textContent = newTask;
            } else {
                alert('Failed to update the task.');
            }
        });
    }
}

  function deleteTask(button) {
      const index = button.getAttribute("data-index");
      if (confirm('Are you sure you want to delete this task?')) {
          fetch('/deleteTask', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ index }),
          })
          .then(response => {
              if (response.status === 200) {
                button.parentElement.parentElement.remove();
              } else {
                  alert('Failed to delete the task.');
              }
          });
      }
  }
