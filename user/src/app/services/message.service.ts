import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../core/models/message';
import { ApiResponse } from '../core/models/api-response';
import { PaginatedResponse } from '../core/models/pagination';

export interface MessageFilters {
  campaign_id?: number;
  status?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getMessages(filters?: MessageFilters): Observable<ApiResponse<PaginatedResponse<Message>>> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof MessageFilters];
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<Message>>>(`${this.apiUrl}/messages`, { params });
  }

  getMessage(id: number): Observable<ApiResponse<Message>> {
    return this.http.get<ApiResponse<Message>>(`${this.apiUrl}/messages/${id}`);
  }

  getCampaignMessages(campaignId: number, page: number = 1, limit: number = 10): Observable<ApiResponse<PaginatedResponse<Message>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<ApiResponse<PaginatedResponse<Message>>>(`${this.apiUrl}/campaigns/${campaignId}/messages`, { params });
  }

  resendMessage(id: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/messages/${id}/resend`, {});
  }
} 