import Handlebars from 'handlebars'

import $ from 'jquery'

var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

import {
  store,
  uuid,
  pluralize
} as util from './util'

Handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });

export function init() {
      todos = util.store('todos-jquery');
      cacheElements();
      bindEvents();

      new Router({
        '/:filter': function (filter) {
          filter = filter;
          render();
        }.bind(this)
      }).init('/all');
    }

export function cacheElements() {
      todoTemplate = Handlebars.compile($('#todo-template').html());
      footerTemplate = Handlebars.compile($('#footer-template').html());
      $todoApp = $('#todoapp');
      $header = $todoApp.find('#header');
      $main = $todoApp.find('#main');
      $footer = $todoApp.find('#footer');
      $newTodo = $header.find('#new-todo');
      $toggleAll = $main.find('#toggle-all');
      $todoList = $main.find('#todo-list');
      $count = $footer.find('#todo-count');
      $clearBtn = $footer.find('#clear-completed');
    }

export function bindEvents() {
      var list = $todoList;
      $newTodo.on('keyup', create.bind(this));
      $toggleAll.on('change', toggleAll.bind(this));
      $footer.on('click', '#clear-completed', destroyCompleted.bind(this));
      list.on('change', '.toggle', toggle.bind(this));
      list.on('dblclick', 'label', edit.bind(this));
      list.on('keyup', '.edit', editKeyup.bind(this));
      list.on('focusout', '.edit', update.bind(this));
      list.on('click', '.destroy', destroy.bind(this));
    }

export function render() {
      var todos = getFilteredTodos();
      $todoList.html(todoTemplate(todos));
      $main.toggle(todos.length > 0);
      $toggleAll.prop('checked', getActiveTodos().length === 0);
      renderFooter();
      $newTodo.focus();
      util.store('todos-jquery', todos);
    }

export function renderFooter() {
      var todoCount = todos.length;
      var activeTodoCount = getActiveTodos().length;
      var template = footerTemplate({
        activeTodoCount: activeTodoCount,
        activeTodoWord: util.pluralize(activeTodoCount, 'item'),
        completedTodos: todoCount - activeTodoCount,
        filter: this.filter
      });

      $footer.toggle(todoCount > 0).html(template);
    }

export function toggleAll(e) {
      var isChecked = $(e.target).prop('checked');

      todos.forEach(function (todo) {
        todo.completed = isChecked;
      });

      render();
    }

export function getActiveTodos() {
      return todos.filter(function (todo) {
        return !todo.completed;
      });
    }

export function getCompletedTodos() {
      return todos.filter(function (todo) {
        return todo.completed;
      });
    }

export function getFilteredTodos() {
      if (filter === 'active') {
        return getActiveTodos();
      }

      if (filter === 'completed') {
        return getCompletedTodos();
      }

      return todos;
    }

export function destroyCompleted() {
      todos = getActiveTodos();
      filter = 'all';
      render();
    }

export function indexFromEl(el) {
      var id = $(el).closest('li').data('id');
      var todos = todos;
      var i = todos.length;

      while (i--) {
        if (todos[i].id === id) {
          return i;
        }
      }
    }

export function create(e) {
      var $input = $(e.target);
      var val = $input.val().trim();

      if (e.which !== ENTER_KEY || !val) {
        return;
      }

      todos.push({
        id: util.uuid(),
        title: val,
        completed: false
      });

      $input.val('');

      render();
    }

export function toggle(e) {
      var i = this.indexFromEl(e.target);
      todos[i].completed = !todos[i].completed;
      render();
    }

export function edit(e) {
      var $input = $(e.target).closest('li').addClass('editing').find('.edit');
      $input.val($input.val()).focus();
    }

export function editKeyup(e) {
      if (e.which === ENTER_KEY) {
        e.target.blur();
      }

      if (e.which === ESCAPE_KEY) {
        $(e.target).data('abort', true).blur();
      }
    }

export function update(e) {
      var el = e.target;
      var $el = $(el);
      var val = $el.val().trim();

      if ($el.data('abort')) {
        $el.data('abort', false);
        render();
        return;
      }

      var i = indexFromEl(el);

      if (val) {
        todos[i].title = val;
      } else {
        todos.splice(i, 1);
      }

      render();
    }

export function destroy(e) {
      this.todos.splice(this.indexFromEl(e.target), 1);
      this.render();
    }
