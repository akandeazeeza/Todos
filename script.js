const userInput = document.querySelector("#userInput");
const btn = document.querySelector("#btn");
const list = document.querySelector("#List");
const API_URL = "https://jsonplaceholder.typicode.com/todos";

function renderTodoItem(todo) {
   const li = document.createElement('li');
   list.appendChild(li);
   li.textContent = todo.title;
}

// read api
async function loadTodos() {
   try {
      const res = await fetch(`${API_URL}?_limit=10`);
      if(!res.ok) {
         throw new Error(`HTTP error! status: ${res.status}`);
      }
      const todos = await res.json()
      todos.forEach(todo => renderTodoItem(todo));
   } catch (err) {
      console.log(`Failed to load todos: ${err.message}`);
   }
}

// post new item when user submit
async function createTodo() {
   const taskText = userInput.value.trim();
   if(!taskText) return alert("please enter a task");
   try {
      const res = await fetch(API_URL, {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            title: taskText,
            completed: false,
            userId: 1
         })
      });
      if(!res.ok) {
         throw new Error(`HTTP error: ${res.status}`);
      }
      const newTodo = await res.json();
      renderTodoItem(newTodo);

      userInput.value = "";
   } catch(err) {
      console.log(`failed to create: ${err.message}`);
   }
}

//update function to include delete
async function renderTodoItem(todo) {
   const li = document.createElement("li");
   // create span for text content
   const taskSpan = document.createElement("span");
   taskSpan.textContent = todo.title;

   //create a delete button
   const deleteBtn = document.createElement("Delete");
   deleteBtn.textContent = "Delete";
   deleteBtn.style.marginLeft = "10px";
   // Evetn Listener for delete request
   deleteBtn.addEventListener("click", () => deleteTodo(todo.id, li));
   // append the text and buton
   li.appendChild(taskSpan);
   li.appendChild(deleteBtn);
   list.appendChild(li);
}

// Delete function to send request
async function deleteTodo(id, liElement) {
   try {
      const res = await fetch(`${API_URL}/${id}`, {
         method: "DELETE"
      });
      if(!res.ok) {
         throw new Error(`HTTP error: ${res.status}`)
      }
      liElement.remove();
   } catch(err) {
      console.log(`Failed to delete: ${err.message}`);
   }
}

btn.addEventListener("click", createTodo);
loadTodos();
