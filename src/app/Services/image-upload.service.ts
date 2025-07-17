import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { cloudinaryConfig } from '../../../cloudinary.config';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

private cloudName = 'dj8qw5wud';
  private uploadPreset = 'HaneensCollection';
  private cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<{ imageUrl: string; mimeType: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post<any>(this.cloudinaryUrl, formData).pipe(
      map((res) => ({
        imageUrl: res.secure_url,
        mimeType: file.type,
      }))
    );
  }}
