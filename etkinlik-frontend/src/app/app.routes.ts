import { Routes } from '@angular/router';

import { Login } from './pages/auth/login/login';
import { Signup } from './pages/auth/signup/signup';
import { Home } from './pages/home/home';

import { Profile } from './pages/profile/profile';
import { MyTickets } from './pages/my-tickets/my-tickets';
import { MyRegistrations } from './pages/my-registrations/my-registrations';
import { EventsComponent } from './pages/events/events';
import { EventRegistration } from './pages/event-registration/event-registration';
import { OrganizerDashboard } from './pages/organizer/organizer-dashboard/organizer-dashboard';
import { CreateEvent } from './pages/organizer/create-event/create-event';
import { MyEvents } from './pages/organizer/my-events/my-events';
import { Participants } from './pages/organizer/participants/participants';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'signup',
    component: Signup
  },
  {
    path: 'home',
    component: Home
  },
  {
    path: 'profile',
    component: Profile
  },
  {
    path: 'my-tickets',
    component: MyTickets
  },
  {
    path: 'profile/my-registrations',
    component: MyRegistrations
  },
  {
    path: 'events',
    component: EventsComponent
  },
  {
    path: 'event-registration/:id',
    component: EventRegistration
  },
  {
    path: 'organizer',
    component: OrganizerDashboard
  },
  {
    path: 'organizer/dashboard',
    component: OrganizerDashboard
  },
  {
    path: 'organizer/create-event',
    component: CreateEvent
  },
  {
    path: 'organizer/edit-event/:id',
    component: CreateEvent
  },
  {
    path: 'organizer/my-events',
    component: MyEvents
  }


];