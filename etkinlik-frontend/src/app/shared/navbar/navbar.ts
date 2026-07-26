import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatSnackBarModule,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  isOrganizer = false;

  isLoggedIn = false;

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit() {

    const user = localStorage.getItem('user');

    this.isLoggedIn = !!user;

    if (user) {

      const parsedUser = JSON.parse(user);

      this.isOrganizer = parsedUser.rol === 'ORGANIZATOR';

    }

  }

  logout() {

    const confirmLogout = confirm("Çıkış yapmak istediğinize emin misiniz?");

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    this.snackBar.open("Başarıyla çıkış yapıldı.", "Kapat", {
      duration: 3000,
      panelClass: ["custom-snackbar"]
    });

    window.location.href = "/login";

  }

}