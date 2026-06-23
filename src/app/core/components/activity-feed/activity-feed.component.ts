import { Component, Input } from '@angular/core';

export interface AdminActivityItem {
  id: string;
  name: string;
  action: string;
  timeLabel: string;
  initial: string;
}

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  templateUrl: './activity-feed.component.html',
})
export class ActivityFeedComponent {
  @Input({ required: true }) items!: readonly AdminActivityItem[];
}

