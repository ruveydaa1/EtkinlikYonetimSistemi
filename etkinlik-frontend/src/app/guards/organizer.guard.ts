import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const organizerGuard: CanActivateFn = () => {

    const router = inject(Router);

    const storedUser = localStorage.getItem('user');


    // Kullanıcı giriş yapmamışsa
    if (!storedUser) {

        alert("Bu sayfayı görmek için giriş yapmalısınız.");

        router.navigate(['/login']);

        return false;

    }


    const user = JSON.parse(storedUser);


    // Organizatör ise izin ver
    if (user.rol === 'ORGANIZATOR') {

        return true;

    }


    // Kullanıcı ama organizatör değilse
    alert("Bu alana sadece organizatörler erişebilir.");

    router.navigate(['/']);

    return false;

};