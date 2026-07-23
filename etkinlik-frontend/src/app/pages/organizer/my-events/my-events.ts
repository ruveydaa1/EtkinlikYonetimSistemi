import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Navbar } from '../../../shared/navbar/navbar';
import { OrganizerSidebar } from '../../../shared/organizer-sidebar/organizer-sidebar';

import { EventService } from '../../../core/services/event';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    Navbar,
    OrganizerSidebar
  ],
  templateUrl: './my-events.html',
  styleUrl: './my-events.css'
})
export class MyEvents implements OnInit {

  events: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadMyEvents();
  }

  loadMyEvents(): void {

    this.eventService.getMyEvents()
      .subscribe({

        next: (response) => {

          this.events = response.data;

          this.cdr.detectChanges();

          console.log("Benim etkinliklerim:", this.events);

        },

        error: (err) => {

          console.error(err);
        }

      });
  }

  deleteEvent(id: number): void {

    const confirmDelete = confirm(
      "Bu etkinliği silmek istediğinize emin misiniz?"
    );

    if (!confirmDelete) {
      return;
    }

    this.eventService.deleteEvent(id)
      .subscribe({

        next: (response) => {

          console.log(response);

          this.snackBar.open(
            "Etkinlik başarıyla silindi.",
            "Kapat",
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['custom-snackbar']
            }
          );

          this.loadMyEvents();

        },

        error: (err) => {

          console.error(err);

          this.snackBar.open(
            err.error.message,
            "Kapat",
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