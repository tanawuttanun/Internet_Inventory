// src/context/ProductsContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { COLORS } from '../constants/theme';

// 🟢 เพิ่ม Type เพื่อให้ระบบรู้โครงสร้างข้อมูลที่ชัดเจน ป้องกัน Error
export type Product = {
  id: string;
  name: string;
  model: string;
  capacity: string;
  price: number;
  image: string;
  colors: string[];
  features: string[];
  rating?: number;
  reviews?: number;
  stock: number;
  isNew?: boolean;
  isCustom?: boolean; // แฟล็กสำหรับเช็คว่าเป็นสินค้าที่เพิ่งเพิ่มเข้ามา
};

const ProductsContext = createContext<any>(null);

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'PowerPay Pro Ultra',
    model: 'PP-U40',
    capacity: '40,000 mAh',
    price: 1990,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80',
    colors: [COLORS.navy, COLORS.gold, COLORS.white],
    features: ['ชาร์จเร็ว 65W', 'หน้าจอ LED', 'รองรับชาร์จไร้สาย'],
    rating: 4.8,
    reviews: 124,
    stock: 50,
    isNew: true,
  },
  {
    id: 'p2',
    name: 'PowerPay Slim Gold',
    model: 'PP-S10',
    capacity: '10,000 mAh',
    price: 890,
    image: 'https://images.unsplash.com/photo-1620189507195-68309c04c4d0?w=800&q=80',
    colors: [COLORS.gold, COLORS.white],
    features: ['บางเฉียบ 12mm', 'น้ำหนักเบาพกพาง่าย'],
    rating: 4.5,
    reviews: 89,
    stock: 100,
    isNew: false,
  }
];

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  // ใช้ State เดียวคุมทั้งหมด เพื่อไม่ให้เกิดบั๊กลบไม่ออก
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const addProduct = (newProduct: Product) => {
    // 💡 เพิ่มแฟล็ก isCustom: true เข้าไป เพื่อให้รู้ว่าเป็นสินค้าที่ถูกเพิ่มเข้ามาใหม่
    setProducts(prev => [{ ...newProduct, isCustom: true }, ...prev]);
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // 💡 กรองเอาเฉพาะสินค้าที่เพิ่มใหม่ (isCustom) ส่งไปให้หน้า add.tsx แสดงผล
  const customProducts = products.filter(p => p.isCustom);

  return (
    <ProductsContext.Provider value={{ 
      products, 
      customProducts, // ส่งกลับไปให้ add.tsx
      addProduct, 
      removeProduct, 
      removeCustomProduct: removeProduct // ส่งชื่อเก่ากลับไปให้ add.tsx ใช้ลบ
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);