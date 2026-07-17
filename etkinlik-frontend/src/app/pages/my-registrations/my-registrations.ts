import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-registrations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './my-registrations.html',
  styleUrl: './my-registrations.css',
})
export class MyRegistrations {

  searchText = '';

  selectedRegistration: any = null;

  registrations = [

    {
      eventName: 'Yaz Festivali 2026',
      category: 'Festival',
      date: '20 Temmuz 2026',
      time: '19:00',
      city: 'Ankara',
      venue: 'ATO Congresium',
      organizer: 'ABC Organizasyon',
      registrationDate: '15 Temmuz 2026',
      status: 'Onaylandı',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
    },

    {
      eventName: 'Teknoloji Zirvesi',
      category: 'Konferans',
      date: '28 Temmuz 2026',
      time: '13:00',
      city: 'İstanbul',
      venue: 'İstanbul Kongre Merkezi',
      organizer: 'Tech Türkiye',
      registrationDate: '18 Temmuz 2026',
      status: 'Beklemede',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800'
    },

    {
      eventName: 'Müzik Gecesi',
      category: 'Konser',
      date: '5 Ağustos 2026',
      time: '20:30',
      city: 'İzmir',
      venue: 'Kültürpark Açıkhava',
      organizer: 'Live Events',
      registrationDate: '1 Ağustos 2026',
      status: 'Reddedildi'
    }

  ];

  get filteredRegistrations() {
    return this.registrations.filter(registration =>
      registration.eventName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }

  openRegistrationDetail(registration: any) {
    this.selectedRegistration = registration;
  }

  closeRegistrationDetail() {
    this.selectedRegistration = null;
  }

}