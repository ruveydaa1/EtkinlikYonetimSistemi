import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { Ticket } from '../../core/services/ticket';
import { Navbar } from '../../shared/navbar/navbar';



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
    MatInputModule,
    Navbar
  ],
  templateUrl: './my-tickets.html',
  styleUrl: './my-tickets.css'
})
export class MyTickets implements OnInit {

  searchText = '';

  constructor(
    private ticketService: Ticket,
    private cdr: ChangeDetectorRef
  ) { }

  tickets: any[] = [];

  ngOnInit(): void {

    this.loadTickets();

  }

  loadTickets(): void {

    this.ticketService.getMyTickets().subscribe({

      next: (response) => {

        this.tickets = response.data;

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  getTicketStatus(ticket: any): string {

    if (!ticket) {
      return '';
    }

    if (ticket.durum === 'IPTAL') {
      return 'İptal';
    }

    const eventDate = new Date(ticket.baslangic_tarihi);
    const today = new Date();

    if (eventDate < today) {
      return 'Geçmiş';
    }

    return 'Aktif';
  }

  get filteredTickets() {

    return this.tickets.filter(ticket =>

      (ticket.etkinlik_adi || '')
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

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
