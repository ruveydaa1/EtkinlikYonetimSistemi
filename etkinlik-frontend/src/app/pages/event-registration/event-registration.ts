import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Navbar } from '../../shared/navbar/navbar';
import { EventService } from '../../core/services/event';
import { ChangeDetectorRef } from '@angular/core';
import { Registration } from '../../core/services/registration';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-registration',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    Navbar,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './event-registration.html',
  styleUrl: './event-registration.css'
})
export class EventRegistration implements OnInit {
  event: any = {};

  registrationForm!: FormGroup;

  eventId!: number;


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private registrationService: Registration,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.eventId = Number(this.route.snapshot.paramMap.get('id'));

    this.registrationForm = this.fb.group({

      confirm: [false]

    });


    this.eventService.getEventById(this.eventId).subscribe({

      next: (response) => {

        this.event = response.data;
        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  register(): void {

    if (!this.registrationForm.value.confirm) {

      this.snackBar.open(
        "Lütfen onay kutusunu işaretleyiniz.",
        "Kapat",
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar']
        }
      );

      return;

    }

    this.registrationService.createRegistration(this.eventId)
      .subscribe({

        next: (response) => {

          console.log("KAYIT:", response);

          this.snackBar.open(
            response.message,
            'Kapat',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['custom-snackbar']
            }
          );

          setTimeout(() => {

            this.router.navigate(['/profile/my-registrations']);

          }, 1500);

          this.router.navigate(['/profile/my-registrations']);

        },
        error: (err) => {

          console.error(err);

          this.snackBar.open(
            err.error.message,
            'Kapat',
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