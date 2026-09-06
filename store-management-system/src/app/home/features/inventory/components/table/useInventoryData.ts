import { useState, useEffect } from "react";
import { productService } from "@/services/product.service";

export interface InventoryItem {
  id: string | number;
  device_model: string;
  sku: string;
  price: number;
  stock_count: number;
  image: string;
  originalProduct?: any;
}

export function useInventoryData(syncTrigger: number = 0) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [flashSuccessId, setFlashSuccessId] = useState<string | number | null>(
    null,
  );

  const loadProducts = async () => {
    try {
      setLoading(true);
      const rawProducts = await productService.fetchProducts(1, 100);
      if (Array.isArray(rawProducts)) {
        const mapped: InventoryItem[] = rawProducts.map(
          (p: any, idx: number) => {
            const modelName = p.name || p.productName || "Unnamed Product";
            const skuCode =
              p.sku ||
              `RMS-${modelName
                .replace(/[^A-Za-z0-9]/g, "")
                .slice(0, 5)
                .toUpperCase()}-${String(p.id || idx + 1).slice(-4)}`;
            return {
              id: p.id || p._id || idx + 1,
              device_model: modelName,
              sku: skuCode,
              price: Number(p.price || 0),
              stock_count: Number(p.quantity ?? p.quantiy ?? p.stockCount ?? 0),
              image:
                p.image ||
                p.imageUrl ||
                "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop&auto=format",
              originalProduct: p,
            };
          },
        );
        setInventory(mapped);
      } else {
        setInventory([]);
      }
    } catch (err) {
      console.error("Failed to load inventory:", err);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [syncTrigger]);

  const handleStockUpdate = async (
    item: InventoryItem,
    newValueStr: string,
  ) => {
    const val = parseInt(newValueStr);
    if (isNaN(val) || val < 0) {
      alert("Please enter a valid stock count.");
      return;
    }

    setInventory((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, stock_count: val } : i)),
    );
    setEditingId(null);

    try {
      await productService.updateProduct(item.id, {
        ...(item.originalProduct || {}),
        quantity: val,
        quantiy: val,
        stockCount: val,
      });

      setFlashSuccessId(item.id);
      setTimeout(() => {
        setFlashSuccessId(null);
      }, 1500);
    } catch (err) {
      console.warn("Failed to persist stock update to server:", err);
    }
  };

  return {
    inventory,
    loading,
    editingId,
    setEditingId,
    editValue,
    setEditValue,
    flashSuccessId,
    handleStockUpdate,
  };
}
