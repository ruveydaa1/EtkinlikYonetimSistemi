import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
    MatIconModule,
    MatSnackBarModule,
    MatRadioModule,
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

  isEditMode = false;
  eventId!: number;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private venueService: VenueService,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
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

      resim: [''],

      durum: ['AKTIF', Validators.required],

      otomatik_onay: [false]

    });

    this.loadCategories();
    this.loadVenues();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.isEditMode = true;
      this.eventId = Number(id);

      this.loadEvent();

    }
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

  loadEvent(): void {

    this.eventService.getEventById(this.eventId).subscribe({

      next: (response) => {

        const event = response.data;

        this.eventForm.patchValue({

          etkinlik_adi: event.etkinlik_adi,
          category_id: event.category_id,
          mekan_id: event.mekan_id,
          baslangic_tarihi: event.baslangic_tarihi?.slice(0, 16),
          bitis_tarihi: event.bitis_tarihi?.slice(0, 16),
          fiyat: event.fiyat,
          max_katilimci_sayisi: event.max_katilimci_sayisi,
          aciklama: event.aciklama,
          resim: event.resim,
          durum: event.durum, 
          otomatik_onay: event.otomatik_onay

        });

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  createEvent(): void {

    if (this.eventForm.invalid) {

      this.eventForm.markAllAsTouched();
      return;

    }

    console.log("Gönderilen form:", this.eventForm.value);

    const request = this.isEditMode
      ? this.eventService.updateEvent(this.eventId, this.eventForm.value)
      : this.eventService.createEvent(this.eventForm.value);

    request.subscribe({

      next: (response) => {

        console.log(response);

        this.snackBar.open(

          this.isEditMode
            ? "Etkinlik başarıyla güncellendi."
            : "Etkinlik başarıyla oluşturuldu.",

          "Kapat",

          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar']
          }

        );

        this.router.navigate(['/organizer/my-events']);

      },

      error: (err) => {

        console.error(err);

        this.snackBar.open(

          err.error.message,

          "Kapat",

          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar']
          }

        );

      }

    });

  }

}