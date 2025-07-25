import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

interface InstagramPost {
  id: number;
  imageUrl: string;
  instagramLink: string;
  imageContentType: string;
  createdAt: string;
  updatedAt: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class InstagramPostService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log('API URL:', this.apiUrl); // Debugging
  }

  uploadPost(image: File, link: string): Observable<any> {
    const formData = new FormData();
    formData.append('Image', image, image.name);
    formData.append('InstagramLink', link);

    console.log('Uploading to:', `${this.apiUrl}/InstagramPost`); // Debugging
    return this.http.post(`${this.apiUrl}/InstagramPost`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

   getInstagramPosts(): Observable<InstagramPost | InstagramPost[]> {
    return this.http.get<InstagramPost | InstagramPost[]>(`${this.apiUrl}/InstagramPost`);
  }
}