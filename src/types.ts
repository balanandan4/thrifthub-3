export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'student' | 'admin';
  college_id?: string;
  branch?: string;
  year?: string;
  phone?: string;
  bio?: string;
}

export type ResourceCategory =
  | 'Textbooks'
  | 'Calculators'
  | 'Notes & Study Materials'
  | 'Drawing & Lab Materials'
  | 'Other College Essentials';

export type ResourceCondition = 'Like New' | 'Good' | 'Fair';

export type ResourceAvailability = 'Available' | 'Requested' | 'Sold';

export interface Resource {
  id: string;
  title: string;
  category: ResourceCategory;
  subject: string;
  semester: string;
  author_or_brand: string;
  price: number;
  condition: ResourceCondition;
  description: string;
  image_url?: string;
  availability: ResourceAvailability;
  seller_id: string;
  created_at: string;
  updated_at: string;
  seller_name?: string;
  seller_branch?: string;
  seller_year?: string;
  seller_email?: string;
  seller_phone?: string;
  request_count?: number;
  pending_request_count?: number;
}

export type RequestStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Completed';

export interface PurchaseRequest {
  id: string;
  resource_id: string;
  buyer_id: string;
  seller_id: string;
  message: string;
  contact_info: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  resource_title?: string;
  resource_category?: ResourceCategory;
  resource_price?: number;
  resource_condition?: ResourceCondition;
  resource_desc?: string;
  resource_availability?: ResourceAvailability;
  buyer_name?: string;
  buyer_email?: string;
  buyer_branch?: string;
  buyer_year?: string;
  buyer_phone?: string;
  seller_name?: string;
  seller_email?: string;
  seller_phone?: string;
}

export interface RequestHistoryItem {
  id: string;
  request_id: string;
  previous_status: string;
  new_status: string;
  actor_id: string;
  actor_name?: string;
  note?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link?: string;
  is_read: number;
  created_at: string;
}

export interface DashboardMetrics {
  total_listings: number;
  active_listings: number;
  total_requests_sent: number;
  pending_incoming: number;
  completed_exchanges: number;
}

export interface AdminStats {
  summary: {
    total_students: number;
    total_resources: number;
    available_resources: number;
    total_requests: number;
    completed_exchanges: number;
    total_value_exchanged: number;
  };
  category_breakdown: { category: string; count: number }[];
  status_breakdown: { status: string; count: number }[];
  monthly_activity: { month: string; listings: number; exchanges: number }[];
}

export interface AuditLog {
  id: string;
  admin_id: string;
  admin_name: string;
  admin_email: string;
  action: string;
  target_type: string;
  target_id: string;
  details: string;
  created_at: string;
}
