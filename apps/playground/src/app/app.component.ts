import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import '@playground/snake-game';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  form = new FormGroup({
    width: new FormControl(5, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(3)],
    }),
    height: new FormControl(5, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(3)],
    }),
  });

  submitted?: { width: number; height: number };

  ngOnInit(): void {
    this.submit();
  }

  submit() {
    this.submitted = {
      width: this.form.value.width as number,
      height: this.form.value.height as number,
    };
  }
}
