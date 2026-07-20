import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../core/services/event';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home implements OnInit {



  upcomingEvents: any[] = [];

  featuredEvents: any[] = [];

  events: any[] = [];

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadEvents();

  }

  loadEvents() {

    this.eventService.getAllEvents().subscribe({

      next: (response) => {

        console.log("API DATA:", response.data);

        this.events = response.data;

        this.upcomingEvents = [...this.events]
          .sort((a, b) =>
            new Date(a.baslangic_tarihi).getTime() -
            new Date(b.baslangic_tarihi).getTime()
          )
          .slice(0, 3);


        this.featuredEvents = this.events.slice(0, 4);


        console.log("Upcoming:", this.upcomingEvents);
        console.log("Featured:", this.featuredEvents);


        this.cdr.detectChanges();

      },

      error: (err) => console.log(err)

    });

  }

}