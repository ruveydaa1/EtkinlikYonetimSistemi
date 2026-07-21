import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService } from '../../core/services/event';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    Navbar
  ],
  templateUrl: './events.html',
  styleUrls: ['./events.css']
})
export class EventsComponent implements OnInit {
  allEvents: any[] = [];
  filteredEvents: any[] = [];
  isLoading: boolean = true;

  searchTerm: string = '';
  selectedCategory: string = 'Tümü';
  selectedCity: string = 'Tümü';

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) { }

  categories: any[] = [];
  cities: any[] = [];

  ngOnInit(): void {
    this.loadEvents();
    this.loadCategories();
    this.loadCities();
  }

  loadCategories(): void {
    this.eventService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Kategoriler yüklenemedi:', err)
    });
  }

  loadCities(): void {
    this.eventService.getCities().subscribe({
      next: (response: any) => {
        this.cities = response.data.map((item: any) => item.sehir);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Şehirler yüklenemedi:', err)
    });
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getAllEvents().subscribe({
      next: (response: any) => {
        // Backend'den gelen yapı { success: true, data: [...] } şeklinde olduğu için veriyi response.data'dan alıyoruz
        const rawData = response.data || response;

        this.allEvents = rawData.map((item: any) => ({
          id: item.event_id,
          ad: item.etkinlik_adi || 'İsimsiz Etkinlik',
          aciklama: item.aciklama || '',
          // Backend'den gelen doğru sütun adı: item.kategori_adi
          kategori: item.kategori_adi || 'Genel',
          // Backend'den gelen doğru şehir/lokasyon: item.sehir
          lokasyon: item.sehir || 'Online',
          baslangic_tarihi: item.baslangic_tarihi,
          fiyat: item.fiyat || 0,
          resim: item.resim || 'assets/default-event.jpg'
        })).reverse();

        this.filteredEvents = [...this.allEvents];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Etkinlikler yüklenirken hata oluştu:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    this.filteredEvents = this.allEvents.filter(event => {
      const matchesSearch = event.ad.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.aciklama.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory = this.selectedCategory === 'Tümü' || event.kategori.toLowerCase() === this.selectedCategory.toLowerCase();
      const matchesCity = this.selectedCity === 'Tümü' || event.lokasyon.toLowerCase().includes(this.selectedCity.toLowerCase());

      return matchesSearch && matchesCategory && matchesCity;
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilter();
  }

  filterByCity(city: string): void {
    this.selectedCity = city;
    this.applyFilter();
    console.log("Filtrelenen etkinlik sayısı:", this.filteredEvents?.length);
  }

  // Modal kontrol değişkenleri
  isModalOpen: boolean = false;
  selectedEvent: any = null;

  openEventDetail(event: any): void {
    // Hangi isimle gelirse gelsin ID'yi yakalayalım
    const eventId = event.etkinlik_id || event.etkinlikId || event.id;

    // Önce karttaki mevcut veriyi atayalım ki modal hemen dolsun
    this.selectedEvent = event;
    this.isModalOpen = true;
    this.cdr.detectChanges();

    if (eventId) {
      this.eventService.getEventById(eventId).subscribe({
        next: (response: any) => {
          // Eğer API veriyi response.data içinde dönüyorsa:
          const eventData = response.data || response;

          this.selectedEvent = {
            ...event, // Karttaki eski verileri koru
            ...eventData // Servisten gelen gerçek verilerle ez
          };
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Etkinlik detayları çekilemedi:', err);
        }
      });
    } else {
      console.warn("Kartın içinde etkinlik ID'si bulunamadı! Gelen nesne:", event);
    }
  }
  // Modalı kapatmak için
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedEvent = null;
    this.cdr.detectChanges();
  }

  // Bilet al / Katıl butonuna basıldığında yönlendirme yapacağımız yer
  goToTicketPage(eventId: number): void {
    // Örnek: Bu kısmı daha sonra bilet alma sayfasına yönlendirmek için kullanacağız
    console.log('Bilet al sayfasına yönlendiriliyor, etkinlik ID:', eventId);
    // this.router.navigate(['/bilet-al', eventId]);
  }
}