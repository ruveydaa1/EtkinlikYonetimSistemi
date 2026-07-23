import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizerSidebar } from '../../../shared/organizer-sidebar/organizer-sidebar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Navbar } from '../../../shared/navbar/navbar';

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
export class OrganizerDashboard {}
