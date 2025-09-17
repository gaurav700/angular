// src/main.ts
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(BrowserModule)
  ]
}).catch(err => console.error(err));
