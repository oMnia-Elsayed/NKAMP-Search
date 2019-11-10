import { Injectable } from '@angular/core';

declare const require;
const translationAR = require('raw-loader!../locale/messages.ar.xlf');
const translationEN = require('raw-loader!../locale/messages.en.xlf');

@Injectable()
export class TranslationService {
  currentLang: string;
  localStorage: any;
  constructor() {
    if (localStorage === null) {
      localStorage = this.getLocalStorage();
    }
    this.currentLang = 'ar-SA';
    if (localStorage !== null && localStorage.getItem('naseej_lang') !== null) {
      this.currentLang = localStorage.getItem('naseej_lang');
    }
  }

  setLanguage(lang: string) {
    this.currentLang = lang;
    localStorage.setItem('naseej_lang', lang);
  }
  getLanguage(): string {
    return this.currentLang;
  }
  getResourceFile(): string {
    let resourceF = translationEN;
    if (this.currentLang === 'ar-SA') {
      resourceF = translationAR;
    }
    return resourceF;
  }
  getLocalStorage() {
    return (typeof window !== 'undefined') ? window.localStorage : null;
  }
}
