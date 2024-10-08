"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const addTodoForm = document.querySelector(".add_todo_form");
    const newTodoField = addTodoForm.querySelector(".new_todo_field");
    const todoItems = document.querySelector(".todo_items");

    // Добавление новой заметки.
    addTodoForm.addEventListener("submit", function (e) {
        e.preventDefault(); // чтобы не перезагружалась страница.

        let newTodoText = newTodoField.value.trim();
        newTodoField.classList.remove("invalid");
        newTodoField.placeholder = "Текст заметки";

        if (newTodoText.length === 0) {
            newTodoField.classList.add("invalid");
            newTodoField.placeholder = "Введите текст заметки!";
            return;
        }

        const todoItem = document.createElement("li");

        function setViewMode() {
            todoItem.innerHTML = `
                <p class="todo_item_text"></p>
                <button class="delete_button">Удалить</button>
                <button class="edit_button">Редактировать</button>
            `;

            todoItem.querySelector(".todo_item_text").textContent = newTodoText;

            // Удаление заметки.
            todoItem.querySelector(".delete_button").addEventListener("click", function () {
                todoItem.remove();
            });

            // Редактирование заметки.
            todoItem.querySelector(".edit_button").addEventListener("click", function () {
                todoItem.innerHTML = `
                    <form class="edit_todo_form">
                        <input class="edit_todo_field" type="text">
                        <button class="save_button" type="submit">Сохранить</button>
                        <button class="cancel_button" type="button">Отмена</button>
                    </form>
                `;

                const editTodoForm = todoItem.querySelector(".edit_todo_form");
                const editTodoField = todoItem.querySelector(".edit_todo_field");
                editTodoField.value = newTodoText;

                todoItem.querySelector(".cancel_button").addEventListener("click", function () {
                    setViewMode();
                });

                editTodoForm.addEventListener("submit", function (e) {
                    e.preventDefault(); // чтобы не перезагружалась страница.

                    const editedText = editTodoField.value.trim();

                    if (editedText.length === 0) {
                        editTodoField.value = "";
                        editTodoField.classList.add("invalid");
                        editTodoField.placeholder = "Введите текст заметки!";
                        return;
                    }

                    newTodoText = editedText;
                    setViewMode();
                });
            });
        }

        setViewMode();

        todoItems.prepend(todoItem);
        newTodoField.value = "";
    });
});