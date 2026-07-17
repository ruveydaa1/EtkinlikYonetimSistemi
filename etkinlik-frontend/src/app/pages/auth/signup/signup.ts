import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { User } from '../../../core/services/user';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,

    RouterLink
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {


  signupForm: FormGroup;


  hidePassword = true;

  hideConfirmPassword = true;


  passwordMatchValidator(form: FormGroup) {

    const password = form.get('sifre')?.value;

    const confirmPassword = form.get('sifreTekrar')?.value;


    if (password !== confirmPassword) {

      form.get('sifreTekrar')?.setErrors({
        passwordMismatch: true
      });

    }

    return null;

  }



  constructor(private fb: FormBuilder,
    private userService: User,
    private router: Router,
    private snackBar: MatSnackBar
  ) {


    this.signupForm = this.fb.group({


      ad: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-ZğüşöçıİĞÜŞÖÇ ]+$')
      ]],


      soyad: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-ZğüşöçıİĞÜŞÖÇ ]+$')
      ]],


      email: ['', [
        Validators.required,
        Validators.email
      ]],


      telefon: ['', [
        Validators.required,
        Validators.pattern('^[0-9]+$'),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],


      sifre: ['', [
        Validators.required,
        Validators.minLength(4)
      ]],


      sifreTekrar: [
        '',
        Validators.required
      ],


      rol: [
        'KULLANICI',
        Validators.required
      ]


    },
      {
        validators: this.passwordMatchValidator
      });

  }



  togglePassword() {

    this.hidePassword = !this.hidePassword;

  }



  toggleConfirmPassword() {

    this.hideConfirmPassword = !this.hideConfirmPassword;

  }



  onSubmit() {

    if (this.signupForm.valid) {

      const user = {
        ad: this.signupForm.value.ad,
        soyad: this.signupForm.value.soyad,
        email: this.signupForm.value.email,
        telefon: this.signupForm.value.telefon,
        sifre: this.signupForm.value.sifre,
        rol: this.signupForm.value.rol
      };

      this.userService.register(user).subscribe({

        next: (response) => {

          console.log(response);

          this.snackBar.open(

            'Kayıt başarıyla oluşturuldu.',

            'Tamam',

            {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            }

          );

          setTimeout(() => {

            this.router.navigate(['/login']);

          }, 2000);

        },

        error: (error) => {

          console.error('Kayıt başarısız!');
          console.error(error);

        }

      });

    }

  }

}