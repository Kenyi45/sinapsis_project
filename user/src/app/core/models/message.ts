export interface Message {
  id: number;
  campaign_id: number;
  phone: string;
  text: string;
  shipping_status: number;
  process_date: string;
  process_hour: string;
  created_at: string;
  updated_at: string;
  campaign_name?: string;
  status_text?: string;
}
