import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-organizer-sidebar',
  imports: [MatIconModule,RouterLink],
  templateUrl: './organizer-sidebar.html',
  styleUrl: './organizer-sidebar.css',
})
export class OrganizerSidebar {}
