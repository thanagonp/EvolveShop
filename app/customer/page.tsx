import { redirect } from "next/navigation";

export default function CustomerHomePage() {
  redirect("/customer/store"); // ✅ รีไดเรกไปที่หน้าแสดงสินค้า
  return null; // 🚀 Next.js ต้องการให้ return ค่าแม้จะเป็น null
}
