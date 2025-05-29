export interface Task {
  id: string;
  title: string;
  description: string;
  reminderTime: Date;
  notificationId?: string;
}