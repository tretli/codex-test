import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { OpeningHoursAdminComponent } from './app/opening-hours-admin/opening-hours-admin.component';

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
      { path: 'admin/opening-hours', component: OpeningHoursAdminComponent }
    ])
  ]
}).catch((error: unknown) => {
  console.error('Bootstrap failed', error);
});
