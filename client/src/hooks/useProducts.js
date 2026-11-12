import { useEffect, useMemo, useState } from "react";
import { ProductService } from "../services/ProductService";
const service = new ProductService();
export const categories = ["Standard", "Pro", "Ultra", "Extreme"];
export function useProducts() {
  const [products, setProducts] = useState([]),
    [activeCategory, setActiveCategory] = useState("Standard"),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    service
      .getProducts()
      .then((items) => alive && setProducts(items))
      .catch(() => alive && setError("Не удалось загрузить каталог."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);
  const filteredProducts = useMemo(
    () => products.filter((product) => product.category === activeCategory),
    [products, activeCategory],
  );
  return {
    products: filteredProducts,
    activeCategory,
    setActiveCategory,
    loading,
    error,
  };
}
