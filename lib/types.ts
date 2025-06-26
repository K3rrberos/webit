export interface Issue {
  id: string;
  name: string;
  description: string;
  comment?: string;
  created_time: string;
  updated_time: string;
  estimated_time: string;
  success_time?: string;
}
