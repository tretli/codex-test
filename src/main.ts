import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { OpeningHoursAdminComponent } from './app/opening-hours-admin/opening-hours-admin.component';
import { OpeningHoursWeekComponent } from './app/opening-hours-week/opening-hours-week.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
class AppComponent {}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', pathMatch: 'full', redirectTo: 'admin/opening-hours' },
      { path: 'admin/opening-hours', component: OpeningHoursAdminComponent },
      { path: 'admin/opening-hours/week', component: OpeningHoursWeekComponent }
    ])
  ]
}).catch((error: unknown) => {
  console.error('Bootstrap failed', error);
});
