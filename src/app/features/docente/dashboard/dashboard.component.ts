import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/services/auth';
import { DocenteApiService } from '../services/docente-api.service';

@Component({
  selector: 'app-docente-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  protected authService = inject(Auth);
  private apiService = inject(DocenteApiService);

  selectedFile = signal<File | null>(null);
  filePreview = signal<string | null>(null);
  uploadMessage = signal<string>('');
  uploadError = signal<string>('');
  uploading = signal(false);
  selectedFileName = signal<string>('Seleccionar archivo');

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile.set(file);
      this.selectedFileName.set(file.name);

      // Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.filePreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadPhoto() {
    const file = this.selectedFile();
    if (!file) return;

    this.uploading.set(true);
    this.uploadError.set('');
    this.uploadMessage.set('');

    this.apiService.uploadFotoPerfil(file).subscribe({
      next: (res) => {
        this.uploading.set(false);
        if (res?.success === false) {
          this.uploadError.set(res.message || 'Error al subir la imagen');
        } else {
          this.uploadMessage.set('Imagen subida correctamente');
        }
      },
      error: (err) => {
        this.uploading.set(false);
        this.uploadError.set('Error al subir la imagen');
        console.error('Upload error:', err);
      },
    });
  }
}
