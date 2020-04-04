import { Component } from '@angular/core';
import { Todo } from 'src/models/todo.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public mode = 'list'
  public todos: Todo[] = [];
  public title: String = 'Lista de Tarefas';
  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      description: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(60),
        Validators.required,
      ])]
    })

    this.load();
  }

  add() {
    const description = this.form.controls['description'].value;

    const id = this.todos.length > 0 ? (this.todos.reduce(function (prev, current) {
      return (prev.id > current.id) ? prev : current
    }).id + 1) : 1

    this.todos.push(new Todo(id, description, false))
    this.save()
    this.clear()
  }

  changeMode(mode: string){
    this.mode = mode
  }

  clear() {
    this.form.reset();
  }

  remove(todo: Todo) {
    const index = this.todos.indexOf(todo);
    if (index !== -1) {
      this.todos.splice(index, 1);
    }
    this.save()
  }

  markAsUndone(todo: Todo) {
    todo.done = false
    this.save()
  }

  markAsDone(todo: Todo) {
    todo.done = true
    this.save()
  }

  save() {
    const data = JSON.stringify(this.todos);
    localStorage.setItem('todos', data);
    this.mode = 'list'
  }

  load() {
    const data = localStorage.getItem('todos');

    if (data) {
      this.todos = JSON.parse(data);
    } else {
      this.todos = []
    }
  }
}
