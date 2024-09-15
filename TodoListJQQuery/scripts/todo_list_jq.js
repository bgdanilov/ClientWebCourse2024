"use strict";

$(function () {
    const addTodoForm = $(".add_todo_form");
    const newTodoField = addTodoForm.find(".new_todo_field");
    const todoItems = $(".todo_items");

    // Добавление новой заметки.
    addTodoForm.submit(function (e) {
        e.preventDefault(); // чтобы не перезагружалась страница.

        let newTodoText = newTodoField.val().trim();
        newTodoField.removeClass("invalid");
        newTodoField.prop("placeholder", "Текст заметки");

        if (newTodoText.length === 0) {
            newTodoField.addClass("invalid");
            newTodoField.prop("placeholder", "Введите текст заметки!");
            return;
        }

        const todoItem = $("<li></li>");

        function setViewMode() {
            todoItem.html(`
                <p class="todo_item_text"></p>
                <button class="delete_button">Удалить</button>
                <button class="edit_button">Редактировать</button>
            `);

            todoItem.find(".todo_item_text").html(newTodoText);

            // Удаление заметки.
            todoItem.find(".delete_button").click(function () {
                todoItem.remove();
            });

            // Редактирование заметки.
            todoItem.find(".edit_button").click(function () {
                todoItem.html(`
                    <form class="edit_todo_form">
                        <input class="edit_todo_field" type="text">
                        <button class="save_button" type="submit">Сохранить</button>
                        <button class="cancel_button" type="button">Отмена</button>
                    </form>
                `);

                const editTodoForm = todoItem.find(".edit_todo_form");
                const editTodoField = editTodoForm.find(".edit_todo_field");
                editTodoField.val(newTodoText);

                todoItem.find(".cancel_button").click(function () {
                    setViewMode();
                });

                editTodoForm.submit(function (e) {
                    e.preventDefault(); // чтобы не перезагружалась страница.

                    const editedText = editTodoField.val().trim();

                    if (editedText.length === 0) {
                        editTodoField.val("");
                        editTodoField.addClass("invalid");
                        editTodoField.prop("placeholder", "Введите текст заметки!");
                        return;
                    }

                    newTodoText = editedText;
                    setViewMode();
                });
            });
        }

        setViewMode();

        todoItems.prepend(todoItem);
        newTodoField.val("");
    });
});