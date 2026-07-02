import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('Error accessing localStorage for key:', key, e);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('Error setting localStorage for key:', key, e);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Error removing localStorage for key:', key, e);
    }
  }
  
  clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Error clearing localStorage', e);
    }
  }
}
