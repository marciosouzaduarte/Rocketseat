export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'default';
  title: string;
  description?: string;
}
