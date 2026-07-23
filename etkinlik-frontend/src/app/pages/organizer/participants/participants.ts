import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { Registration } from '../../../core/services/registration';
import { Navbar } from '../../../shared/navbar/navbar';
import { OrganizerSidebar } from '../../../shared/organizer-sidebar/organizer-sidebar';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [
    CommonModule,

    Navbar,
    OrganizerSidebar,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './participants.html',
  styleUrl: './participants.css'
})
export class Participants implements OnInit {

  selectedEvent = '';

  searchText = '';

  selectedStatus = '';

  constructor(
    private registrationService: Registration,
    private cdr: ChangeDetectorRef
  ) { }

  events: any[] = [];

  approve(participant: any) {


    this.registrationService
      .updateRegistration(
        participant.id,
        "ONAYLANDI"
      )
      .subscribe({

        next: (response) => {

          console.log(response);


          participant.status = "ONAYLANDI";


          this.cdr.detectChanges();


        },


        error: (err) => {

          console.error(err);

        }

      });


  }

  reject(participant: any) {


    this.registrationService
      .updateRegistration(
        participant.id,
        "REDDEDILDI"
      )
      .subscribe({

        next: (response) => {

          console.log(response);


          participant.status = "REDDEDILDI";


          this.cdr.detectChanges();


        },


        error: (err) => {

          console.error(err);

        }

      });


  }

  ngOnInit(): void {

    this.loadEvents();

  }


  loadEvents(): void {

    this.registrationService.getOrganizerEvents()
      .subscribe({

        next: (response) => {

          console.log(
            "ORGANIZER EVENTS:",
            response
          );

          this.events = response.data;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            "Başvurular getirilemedi:",
            err
          );

        }

      });

  }

  getPendingCount(event: any): number {

    return event.participants.filter(
      (participant: any) => participant.status === 'BEKLEMEDE'
    ).length;

  }

}