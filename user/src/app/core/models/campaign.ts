export interface Campaign {
  id: number;
  name: string;
  message_text: string;
  phone_list: string | string[];
  user_id: number;
  username?: string;
  process_date: string;
  process_status: CampaignStatus;
  total_messages: number;
  sent_messages: number;
  failed_messages: number;
  pending_messages: number;
  created_at: string;
  updated_at: string;
}

export enum CampaignStatus {
  PENDING = 0,
  PROCESSING = 1,
  COMPLETED = 2,
  ERROR = 3
}

export function getCampaignStatusText(status: CampaignStatus): string {
  switch (status) {
    case CampaignStatus.PENDING:
      return 'Pendiente';
    case CampaignStatus.PROCESSING:
      return 'Procesando';
    case CampaignStatus.COMPLETED:
      return 'Completada';
    case CampaignStatus.ERROR:
      return 'Error';
    default:
      return 'Desconocido';
  }
}

export function getCampaignStatusClass(status: CampaignStatus): string {
  switch (status) {
    case CampaignStatus.PENDING:
      return 'status-pending';
    case CampaignStatus.PROCESSING:
      return 'status-processing';
    case CampaignStatus.COMPLETED:
      return 'status-completed';
    case CampaignStatus.ERROR:
      return 'status-error';
    default:
      return 'status-unknown';
  }
}
