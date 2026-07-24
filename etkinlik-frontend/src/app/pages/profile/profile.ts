import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { User } from '../../core/services/user';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ticket } from '../../core/services/ticket';
import { Registration } from '../../core/services/registration';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    ReactiveFormsModule,
    RouterLink,
    Navbar
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  constructor(
    private ticketService: Ticket,
    private registrationService: Registration,
    private userService: User,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  user: any = {};

  nextEvent: any = null;

  lastRegistrations: any[] = [];

  summary = {
    totalRegistrations: 0,
    activeTickets: 0,
    pendingRegistrations: 0,
    totalSpent: 0
  };


  profileForm!: FormGroup;

  userId!: number;
  // Şu an açık olan bölüm
  activeSection: string | null = null;

  passwordForm!: FormGroup;

  // Kartlara tıklanınca çalışacak
  toggleSection(section: string): void {

    if (this.activeSection === section) {
      this.activeSection = null;
    } else {
      this.activeSection = section;
    }

  }

  deleteDialog = false;

  openDeleteDialog() {
    this.deleteDialog = true;
  }

  closeDeleteDialog() {
    this.deleteDialog = false;
  }


  showProfilePassword = false;

  // Profil düzenleme dialogu
  editMode = false;

  openEditProfile() {
    this.editMode = true;
  }

  closeEditProfile() {
    this.editMode = false;
  }

  saveProfile() {

    const updatedUser = this.profileForm.value;

    this.userService.updateUser(this.userId, updatedUser).subscribe({

      next: () => {

        localStorage.setItem(
          'user',
          JSON.stringify(this.user)
        );

        alert("Profil güncellendi.");

        this.closeEditProfile();

        this.loadUser();

      },

      error: (err) => {

        console.log(err);

        console.log(err.error);

        console.log(err.error.message);

        alert(JSON.stringify(err.error));

      }
    });

  }


  passwordDialog = false;

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  changePassword() {
    this.openPasswordDialog();
  }

  openPasswordDialog() {
    this.passwordDialog = true;
  }

  closePasswordDialog() {

    this.passwordDialog = false;

    this.passwordForm.reset();

  }

  savePassword() {

    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = this.passwordForm.value;

    if (!currentPassword || !newPassword || !confirmPassword) {

      alert("Lütfen tüm alanları doldurun.");
      return;

    }

    if (newPassword.length < 4) {

      alert("Yeni şifre en az 4 karakter olmalıdır.");
      return;

    }

    if (newPassword !== confirmPassword) {

      alert("Yeni şifreler eşleşmiyor.");
      return;

    }

    this.userService.changePassword(this.userId, {
      currentPassword,
      newPassword
    }).subscribe({

      next: (response) => {

        alert(response.message);

        this.passwordForm.reset();

        this.closePasswordDialog();

      },

      error: (err) => {

        alert(err.error.message);

      }

    });

  }

  ngOnInit(): void {

    const token = localStorage.getItem('token');

    if (!token) {

      alert("Profil bilgilerinizi görmek için giriş yapmalısınız.");

      this.router.navigate(['/login']);

      return;

    }

    this.profileForm = this.fb.group({

      ad: ['', Validators.required],
      soyad: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefon: ['', Validators.required],
      rol: ['']

    });

    this.passwordForm = this.fb.group({

      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required]

    });

    console.log("Token:", localStorage.getItem("token"));
    console.log("User:", localStorage.getItem("user"));

    const storedUser = localStorage.getItem('user');

    if (storedUser) {

      const user = JSON.parse(storedUser);

      this.userId = user.user_id;

      this.loadUser();

    }

  }

  loadUser(): void {

    this.loadLastTickets();
    this.loadLastRegistrations();

    this.userService.getUserById(this.userId).subscribe({

      next: (response) => {

        setTimeout(() => {

          this.user = response.data;

          this.profileForm.patchValue({

            ad: this.user.ad,
            soyad: this.user.soyad,
            email: this.user.email,
            telefon: this.user.telefon,
            rol: this.user.rol

          });

          this.cdr.detectChanges();

          console.log("SETTIMEOUT USER:", this.user);

        }, 0);

      },

      error: (err) => {

        console.error(err);

      }

    });

  }

  loadLastTickets() {

    this.ticketService.getMyTickets().subscribe({

      next: (response) => {

        console.log("TICKETS GELDİ:", response);

        this.summary.activeTickets =
          response.data.filter(
            (ticket: any) =>
              this.getTicketStatus(ticket.baslangic_tarihi) === 'Aktif'
          ).length;

        this.summary.totalSpent =
          response.data.reduce(
            (total: number, ticket: any) =>
              total + Number(ticket.fiyat),
            0
          );
        this.cdr.detectChanges();

      },

      error: (err) => console.log(err)

    });

  }

  loadLastRegistrations() {

    this.registrationService.getMyRegistrations().subscribe({

      next: (response) => {

        console.log("REGISTRATION GELDİ:", response);

        this.lastRegistrations = [...response.data.slice(0, 2)];

        console.log("LAST REG:", this.lastRegistrations);

        this.summary.totalRegistrations = response.data.length;

        this.summary.pendingRegistrations =
          response.data.filter(
            (r: any) => r.durum === 'BEKLEMEDE'
          ).length;
        const upcoming = response.data
          .filter((registration: any) =>
            registration.durum !== 'REDDEDILDI' &&
            registration.durum !== 'IPTAL' &&
            registration.etkinlik_durumu === 'AKTIF' &&
            new Date(registration.baslangic_tarihi) > new Date()
          )
          .sort((a: any, b: any) =>
            new Date(a.baslangic_tarihi).getTime() -
            new Date(b.baslangic_tarihi).getTime()
          );

        this.nextEvent = upcoming.length ? upcoming[0] : null;
        this.cdr.detectChanges();

      },

      error: (err) => console.log(err)

    });

  }

  getTicketStatus(eventDate: string): string {

    const today = new Date();

    const event = new Date(eventDate);

    return event < today ? 'Pasif' : 'Aktif';

  }

  deleteAccount() {

    this.openDeleteDialog();

  }

  confirmDeleteAccount() {

    this.userService.deleteUser(this.userId).subscribe({

      next: (response) => {

        alert(response.message);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        this.closeDeleteDialog();

        this.router.navigate(['/login']);

      },

      error: (err) => {

        alert(err.error.message);

      }

    });

  }
}

