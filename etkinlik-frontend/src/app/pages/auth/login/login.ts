import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { User } from '../../../core/services/user';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,

    RouterLink,

    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private userService: User,
    private router: Router,
    private snackBar: MatSnackBar
  ) {

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      sifre: [
        '',
        [
          Validators.required,
          Validators.minLength(4)
        ]
      ]

    });

  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {

    if (this.loginForm.valid) {

      const user = {

        email: this.loginForm.value.email,
        sifre: this.loginForm.value.sifre

      };

      this.userService.login(user).subscribe({

        next: (response) => {

          // Token'ı kaydet
          localStorage.setItem('token', response.token);

          // Kullanıcı bilgisini de kaydedelim
          localStorage.setItem(
            'user',
            JSON.stringify(response.user)
          );

          // Başarı bildirimi
          this.snackBar.open(

            'Giriş başarılı.',

            undefined,

            {

              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['custom-snackbar']

            }

          );

          // Dashboard'a yönlendir
          setTimeout(() => {

            this.router.navigate(['/home']);

          }, 2000);

        },

        error: (error) => {

          console.error(error);

          this.snackBar.open(

            error.error.message,

            undefined,

            {

              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['custom-snackbar']

            }

          );

        }

      });

    }

  }
}