import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { OrganizerSidebar } from '../../../shared/organizer-sidebar/organizer-sidebar';
import { Navbar } from '../../../shared/navbar/navbar';
import { EventService } from '../../../core/services/event';
import { CategoryService } from '../../../core/services/category';
import { VenueService } from '../../../core/services/venue';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    Navbar,
    OrganizerSidebar
  ],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css'
})
export class CreateEvent implements OnInit {

  eventForm!: FormGroup;

  categories: any[] = [];
  venues: any[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private venueService: VenueService,
    private eventService: EventService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.eventForm = this.fb.group({

      etkinlik_adi: ['', Validators.required],

      category_id: ['', Validators.required],

      mekan_id: ['', Validators.required],

      baslangic_tarihi: ['', Validators.required],

      bitis_tarihi: ['', Validators.required],

      fiyat: [0, Validators.required],

      max_katilimci_sayisi: [1, Validators.required],

      aciklama: ['', Validators.required],

      resim: ['']

    });

    this.loadCategories();
    this.loadVenues();

  }

  loadCategories(): void {

    this.categoryService.getAllCategories().subscribe({

      next: (response) => {

        this.categories = response.data;

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  loadVenues(): void {

    this.venueService.getAllVenues().subscribe({

      next: (response) => {

        this.venues = response.data;

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  createEvent(): void {

    this.eventService.createEvent(this.eventForm.value)
      .subscribe({

        next: (response) => {

          console.log(response);

          alert("Etkinlik başarıyla oluşturuldu.");

          this.router.navigate(['/organizer/events']);

        },

        error: (err) => {

          console.error(err);

          alert(err.error.message);

        }

      });

  }
}