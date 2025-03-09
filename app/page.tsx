import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/customer/store"); 
  return null; // ✅ ต้องมี return ค่า ไม่งั้น Next.js จะ error
}
