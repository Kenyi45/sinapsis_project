import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/campaigns',
    pathMatch: 'full'
  },
  {
    path: 'campaigns',
    loadComponent: () => import('./components/campaign-list/campaign-list.component').then(m => m.CampaignListComponent)
  },
  {
    path: 'campaigns/new',
    loadComponent: () => import('./components/campaign-form/campaign-form.component').then(m => m.CampaignFormComponent)
  },
  {
    path: 'campaigns/:id',
    loadComponent: () => import('./components/campaign-detail/campaign-detail.component').then(m => m.CampaignDetailComponent)
  },
  {
    path: 'campaigns/:id/messages',
    loadComponent: () => import('./components/message-list/message-list.component').then(m => m.MessageListComponent)
  },
  {
    path: '**',
    redirectTo: '/campaigns'
  }
];
