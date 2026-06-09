import { bootstrapApplication } from '@angular/platform-browser';
import { provideIonicAngular } from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig))
  ],
});