import Image from "next/image";
import InventarioPage from "./components/tabla";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-black">
      <InventarioPage />
    </div>
  );
}
