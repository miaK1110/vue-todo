import Vue from 'vue';
import UUID from 'uuidjs';

new Vue({
  el: '#app',
  data: {
    error: false,
    newTodoText: '',
    searchWord: '',
    todos: [
      {
        id: UUID.generate(),
        text: 'Click todo to edit',
        editText: 'Click todo to edit',
        editMode: false,
        isComplete: false,
      },
      {
        id: UUID.generate(),
        text: 'Tick the todo to set to done',
        editText: 'Tick the todo to set to done',
        editMode: false,
        isComplete: false,
      },
      {
        id: UUID.generate(),
        text: 'Click bin to delete todo',
        editText: 'Click bin to delete todo',
        editMode: false,
        isComplete: true,
      },
    ],
  },
  computed: {
    filteredTodos: function () {
      let todos = [];

      for (let i in this.todos) {
        let todo = this.todos[i];
        let text = todo.text.toLowerCase();

        if (text.indexOf(this.searchWord) > -1) {
          todos.push(todo);
        }
      }

      return todos;
    },
  },
  methods: {
    addTodo: function () {
      if (this.newTodoText === '') {
        this.error = true;
        return;
      }

      const todo = {
        id: UUID.generate(),
        text: this.newTodoText,
        editText: this.newTodoText,
        isComplete: false,
        editMode: false,
      };
      this.todos.push(todo);
      this.newTodoText = '';
    },
    toggleTodoToDone: function (todo) {
      todo.isComplete = !todo.isComplete;
    },
    switchEditMode: function (todo, index) {
      todo.editMode = true;

      // this.$refs.inputEdit[index].select();
      this.$nextTick(() => {
        this.$refs.inputEdit[index].focus();
      });
    },
    selectInputEdit(index) {
      this.$refs.inputEdit[index].select();
    },
    removeFocus: function (todo) {
      if (!todo.editText || todo.editText === '') {
        todo.editText = todo.text;
      }
      todo.text = todo.editText;
      todo.editMode = false;
    },
    keyupCloseEditMode(todo) {
      if (!todo.editText || todo.editText === '') {
        todo.editText = todo.text;
      }
      todo.text = todo.editText;
      todo.editMode = false;
    },
    deleteTodo: function (index) {
      this.todos.splice(index, 1);
    },
  },
});
