import { API_BASE_URL } from "@/config";
import { CldImage } from "next-cloudinary";

async function getProduct(id : string) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error("โหลดสินค้าล้มเหลว");
  return res.json();
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CldImage
          src={product.images[0]}
          alt={product.name}
          width={500}
          height={500}
          className="w-full h-auto object-cover rounded-lg"
        />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-xl font-bold mt-4">{product.price} บาท</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
            เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
    </div>
  );
}
