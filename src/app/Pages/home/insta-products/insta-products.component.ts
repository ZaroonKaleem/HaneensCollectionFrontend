import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InstagramPostService } from '../../../Services/instagram-post.service';
import { NgOptimizedImage } from '@angular/common';

interface InstagramPost {
  id: number;
  imageUrl: string;
  instagramLink: string;
  imageContentType: string;
  createdAt: string;
  updatedAt: string | null;
}

@Component({
  selector: 'app-insta-products',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './insta-products.component.html',
  styleUrls: ['./insta-products.component.css']
})
export class InstaProductsComponent implements OnInit {
  posts: InstagramPost[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private instagramPostService: InstagramPostService) {}

  openInstagramLink(link: string) {
    window.open(link, '_blank', 'noopener,noreferrer');
  }
  
  ngOnInit(): void {
    this.fetchInstagramPosts();
  }

  fetchInstagramPosts(): void {
    this.isLoading = true;
    this.error = null;

    this.instagramPostService.getInstagramPosts().subscribe({
      next: (data) => {
        this.posts = (Array.isArray(data) ? data : [data]).slice(0, 4);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load Instagram posts:', err);
        this.error = 'Failed to load Instagram posts. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  getImageSrc(post: InstagramPost): string {
    // Handle cases where imageUrl might already be a complete data URL
    if (post.imageUrl.startsWith('data:')) {
      return post.imageUrl;
    }
    
    // Handle cases where imageContentType might be missing
    const contentType = post.imageContentType || 'image/jpeg';
    
    return `data:${contentType};base64,${post.imageUrl}`;
  }

  trackByPostId(index: number, post: InstagramPost): number {
    return post.id;
  }
}