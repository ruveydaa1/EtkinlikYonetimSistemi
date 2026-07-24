import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  isOrganizer = false;

  isLoggedIn = false;

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

    alert("Başarıyla çıkış yapıldı.");

    window.location.href = "/login";

  }

}