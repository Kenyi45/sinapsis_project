import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campaign } from '../core/models/campaign';
import { ApiResponse } from '../core/models/api-response';
import { PaginatedResponse } from '../core/models/pagination';

export interface CampaignFilters {
  start_date?: string;
  end_date?: string;
  user_id?: number;
  status?: number;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getCampaigns(filters?: CampaignFilters): Observable<ApiResponse<PaginatedResponse<Campaign>>> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof CampaignFilters];
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<Campaign>>>(`${this.apiUrl}/campaigns`, { params });
  }

  getCampaign(id: number): Observable<ApiResponse<Campaign>> {
    return this.http.get<ApiResponse<Campaign>>(`${this.apiUrl}/campaigns/${id}`);
  }

  createCampaign(campaign: Partial<Campaign>): Observable<ApiResponse<Campaign>> {
    return this.http.post<ApiResponse<Campaign>>(`${this.apiUrl}/campaigns`, campaign);
  }

  updateCampaign(id: number, campaign: Partial<Campaign>): Observable<ApiResponse<Campaign>> {
    return this.http.put<ApiResponse<Campaign>>(`${this.apiUrl}/campaigns/${id}`, campaign);
  }

  deleteCampaign(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/campaigns/${id}`);
  }

  processCampaign(id: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/campaigns/${id}/process`, {});
  }

  getCampaignMessages(campaignId: number, page: number = 1, limit: number = 10): Observable<ApiResponse<any>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/campaigns/${campaignId}/messages`, { params });
  }
} 