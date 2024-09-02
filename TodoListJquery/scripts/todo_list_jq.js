"use strict";

$(function () {
    const addTodoForm = $("#add_todo_form");
    const newTodoField = addTodoForm.find(".new_todo_field");

    const todoList = $("#todo_list");

    // Добавление новой заметки.
    addTodoForm.submit(function (e) {
        e.preventDefault(); // чтобы не перезагружалась страница.

        let newTodoText = newTodoField.val().trim();
        newTodoField.removeClass("invalid");
        newTodoField.attr("placeholder", "Текст заметки");

        if (newTodoText.length === 0) {
            newTodoField.addClass("invalid");
            newTodoField.attr("placeholder", "Введите текст заметки!");
            return;
        }

        const todoItem = $("<li></li>");

        function setViewMode() {
            todoItem.html(`
                <span class="todo_item_text"></span>
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
                    <form class="edit_todo_form" id="edit_todo_form">
                        <input class="edit_todo_field" type="text">
                        <button class="save_button" type="submit">Сохранить</button>
                        <button class="cancel_button" type="button">Отмена</button>
                    </form>
                `);

                const editTodoForm = $("#edit_todo_form");
                const editTodoField = editTodoForm.find(".edit_todo_field");
                editTodoField.val(newTodoText);

                todoItem.find(".cancel_button").click(function () {
                    setViewMode();
                });

                editTodoForm.submit(function (e) {
                    e.preventDefault(); // чтобы не перезагружалась страница.

                    const temp = editTodoField.val().trim();

                    if (temp.length === 0) {
                        editTodoField.val("");
                        editTodoField.addClass("invalid");
                        editTodoField.attr("placeholder", "Введите текст заметки!");
                        return;
                    }

                    newTodoText = temp;
                    setViewMode();
                });
            });
        }

        setViewMode();

        todoList.prepend(todoItem);
        newTodoField.val("");
    });
});