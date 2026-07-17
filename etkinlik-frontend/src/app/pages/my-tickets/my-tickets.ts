import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './my-tickets.html',
  styleUrl: './my-tickets.css'
})
export class MyTickets {

  searchText = '';

  tickets = [
    {
      eventName: 'Yaz Festivali 2026',
      category: 'Festival',
      date: '20 Temmuz 2026',
      time: '19:00',
      city: 'Ankara',
      venue: 'ATO Congresium',
      organizer: 'ABC Organizasyon',
      ticketNumber: '123456',
      seat: 'Serbest Oturma',
      price: '250 ₺',
      status: 'Aktif',
      createdAt: '15 Temmuz 2026'
    },
    {
      eventName: 'Teknoloji Zirvesi',
      category: 'Konferans',
      date: '28 Temmuz 2026',
      time: '13:00',
      city: 'İstanbul',
      venue: 'İstanbul Kongre Merkezi',
      organizer: 'Tech Türkiye',
      ticketNumber: '654321',
      seat: 'B18',
      price: '450 ₺',
      status: 'Aktif',
      createdAt: '18 Temmuz 2026'
    }
  ];
  get filteredTickets() {
    return this.tickets.filter(ticket =>
      ticket.eventName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  selectedTicket: any = null;

  openTicketDetail(ticket: any) {
    this.selectedTicket = ticket;
  }

  closeTicketDetail() {
    this.selectedTicket = null;
  }

}
