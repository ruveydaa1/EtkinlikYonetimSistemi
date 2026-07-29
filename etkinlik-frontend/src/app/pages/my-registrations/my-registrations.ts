import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Registration } from '../../core/services/registration';
import { OnInit, ChangeDetectorRef , ChangeDetectionStrategy} from '@angular/core';
import { BACKEND_URL } from '../../core/config/api.config';

@Component({
  selector: 'app-my-registrations',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class MyRegistrations implements OnInit {

  searchText = '';

  selectedRegistration: any = null;

  constructor(

    private registrationService: Registration,
    private cdr: ChangeDetectorRef

  ) { }

  registrations: any[] = [];

  ngOnInit(): void {

    this.loadRegistrations();

  }

  loadRegistrations() {

    this.registrationService.getMyRegistrations().subscribe({

      next: (response) => {

        console.log(response);

        this.registrations = response.data;

        this.cdr.markForCheck();

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  get filteredRegistrations() {

    return this.registrations.filter(registration =>

      (registration.etkinlik_adi ?? '')
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

  getImageUrl(image: string | null | undefined): string {

    if (!image) {
      return '';
    }

    if (image.startsWith('http')) {
      return image;
    }

    return `${BACKEND_URL}/${image}`;
  }

}