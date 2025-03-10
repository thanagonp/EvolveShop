export interface OrderItem {
    product: string; // ใช้ ObjectId เป็น string
    name: string;
    image?: string;
    quantity: number;
    price: number;
  }
  
  export interface CustomerInfo {
    name: string;
    address: string;
    phone: string;
  }
  
  export enum OrderStatus {
    Pending = "pending",        // รอยืนยันจากเจ้าของร้าน
    Confirmed = "confirmed",    // รอจัดส่ง
    Shipped = "shipped",        // จัดส่งแล้ว (มี Tracking Number)
    Cancelled = "cancelled",    // ถูกยกเลิก
  }
  
  export interface Order {
    _id: string;
    customer: CustomerInfo;
    items: OrderItem[];
    totalAmount: number;
    paymentSlip: string;
    status: OrderStatus;
    trackingNumber?: string; // ✅ ต้องกรอกเมื่อ "shipped"
    createdAt?: string;
    updatedAt?: string;
  }
  
  