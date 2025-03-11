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

  export interface Product {
    _id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
    color: string;
    size: string;
    description?: string;
    status: "available" | "unavailable";
  }

  // 📌 Interface สำหรับสินค้าในตะกร้า
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

// 📌 Interface สำหรับ Context ตะกร้าสินค้า
export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
}

  
  