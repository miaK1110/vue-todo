import Vue from 'vue';

new Vue({
  el: '#app',
  data: {
    error: false,
    newTodoText: '',
    todos: [
      {
        id: 1,
        text: 'Click todo to edit',
        editMode: false,
        isComplete: false,
      },
      {
        id: 2,
        text: 'Tick the todo to set to done',
        editMode: false,
        isComplete: false,
      },
      {
        id: 3,
        text: 'Click bin to delete todo',
        editMode: false,
        isComplete: false,
      },
      // { id: 1, text: 'texttext' },
      // { id: 2, text: 'texttext' },
      // { id: 2, text: 'texttext' },
    ],
  },
  methods: {
    addTodo: function () {
      alert(newTodoText);
      this.newTodoText = '';
    },
    toggleIsCompleteState: function (todo) {
      alert(JSON.stringify(todo));
      todo.isComplete = !isComplete;
      alert(isComplete);
    },
    // switchEditMode: function () {
    //   todo.editMode = true;
    // },
    deleteTodo: function (index) {
      this.todos.splice(index, 1);
    },
  },
});
