import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    RouterLink
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  // Şu an açık olan bölüm
  activeSection: string | null = null;

  // Kartlara tıklanınca çalışacak
  toggleSection(section: string): void {

    if (this.activeSection === section) {
      this.activeSection = null;
    } else {
      this.activeSection = section;
    }

  }

  // Profil düzenleme dialogu
  editMode = false;

  openEditProfile() {
    this.editMode = true;
  }

  closeEditProfile() {
    this.editMode = false;
  }

  saveProfile() {
    alert("Profil bilgileri güncellendi.");
    this.closeEditProfile();
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
  }

  savePassword() {
    alert("Şifre başarıyla güncellendi.");
    this.closePasswordDialog();
  }


  logout() {

    alert("Çıkış yapıldı.");

  }

}

