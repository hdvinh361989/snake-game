import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import '@playground/snake-game';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, JsonPipe],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  form = new FormGroup({
    width: new FormControl(10, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(10)],
    }),
    height: new FormControl(10, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(10)],
    }),
    speed: new FormControl(1000, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(200)],
    }),
  });

  submitted?: { dimension: { width: number; height: number }; speed: number };

  ngOnInit(): void {
    this.submit();
  }

  submit() {
    const { width, height, speed } = this.form.value as Record<string, number>;
    this.submitted = {
      dimension: { width, height },
      speed,
    };
  }
}
