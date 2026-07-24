import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizerSidebar } from '../../../shared/organizer-sidebar/organizer-sidebar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Navbar } from '../../../shared/navbar/navbar';
import { EventService } from '../../../core/services/event';

@Component({
  selector: 'app-organizer-dashboard',
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    Navbar,
    OrganizerSidebar
  ],
  templateUrl: './organizer-dashboard.html',
  styleUrl: './organizer-dashboard.css',
})
export class OrganizerDashboard implements OnInit {

  organizerName = '';

  totalEvents = 0;

  pendingRegistrations = 0;

  approvedRegistrations = 0;

  totalParticipants = 0;

  recentActivities: any[] = [];

  events: any[] = [];

  upcomingEvents: any[] = [];

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    this.organizerName = user.ad;

    this.loadDashboard();

  }

  loadDashboard() {

    this.eventService.getMyEvents().subscribe({

      next: (response: any) => {

        this.events = response.data;

        this.totalEvents = this.events.length;

        this.pendingRegistrations = this.events.reduce(
          (sum: number, event: any) =>
            sum + Number(event.bekleyen_basvuru),
          0
        );

        this.totalParticipants = this.events.reduce(
          (sum: number, event: any) =>
            sum + Number(event.onayli_katilimci),
          0
        );

        this.approvedRegistrations = this.totalParticipants;

        this.upcomingEvents = [...this.events]
          .filter((event: any) =>
            new Date(event.baslangic_tarihi) >= new Date()
          )
          .sort(
            (a: any, b: any) =>
              new Date(a.baslangic_tarihi).getTime() -
              new Date(b.baslangic_tarihi).getTime()
          )
          .slice(0, 3);

        this.cdr.detectChanges();

      },

      error: (err) => console.log(err)

    });

  }

}
