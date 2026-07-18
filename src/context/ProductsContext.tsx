// src/context/ProductsContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { COLORS } from '../constants/theme';

export type Product = {
  id: string;
  name: string;
  model: string;
  capacity: string;
  price: number;
  image: any; // 💡 สำคัญ: ต้องใช้ any เพื่อให้รองรับไฟล์ภาพจาก require()
  colors: string[];
  features: string[];
  stock: number;
  isNew?: boolean;
  isCustom?: boolean;
};

const ProductsContext = createContext<any>(null);

// 🟢 ข้อมูลสินค้า 10 รุ่นของจริง พร้อมดึงรูปจาก assets ในเครื่อง
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Apple MagSafe Battery Pack",
    model: "MJWY3ZA/A",
    capacity: "1,460 mAh",
    price: 3890,
    image: require('./pb1.jpg'),
    colors: [COLORS.white],
    features: ['แนบติดด้วยแม่เหล็ก', 'ชาร์จไร้สาย 15W', 'ดีไซน์กะทัดรัด'],
    stock: 25,
    isNew: true,
  },
  {
    id: "p2",
    name: "Anker PowerCore 10000",
    model: "A1214",
    capacity: "10,000 mAh",
    price: 990,
    image: require('./pb2.jpg'),
    colors: [COLORS.navy, '#000000'],
    features: ['เทคโนโลยี PowerIQ', 'ขนาดเล็กกว่าบัตรเครดิต', 'ปลอดภัยสูง'],
    stock: 80,
    isNew: false,
  },
  {
    id: "p3",
    name: "Eloop E29",
    model: "E29",
    capacity: "30,000 mAh",
    price: 1290,
    image: require('./pb3.jpg'),
    colors: ['#333333', COLORS.navy],
    features: ['ชาร์จเร็ว Quick Charge 3.0', 'วัสดุอลูมิเนียม', 'ชาร์จพร้อมกัน 2 เครื่อง'],
    stock: 120,
    isNew: false,
  },
  {
    id: "p4",
    name: "ZMI QB823 Pro",
    model: "QB823",
    capacity: "20,000 mAh",
    price: 2490,
    image: require('./pb4.jpg'),
    colors: ['#2C3E50'],
    features: ['จ่ายไฟสูงสุด 65W', 'ชาร์จ MacBook ได้', 'พอร์ต USB-C 2 ช่อง'],
    stock: 45,
    isNew: true,
  },
  {
    id: "p5",
    name: "Baseus Blade 100W",
    model: "PPDGL-01",
    capacity: "20,000 mAh",
    price: 1990,
    image: require('./pb5.jpg'),
    colors: ['#000000'],
    features: ['บางเฉียบ 18 มม.', 'มีจอ LED แสดงเวลาชาร์จ', 'กำลังไฟ 100W'],
    stock: 30,
    isNew: true,
  },
  {
    id: "p6",
    name: "Aukey Basix Mini",
    model: "PB-N83",
    capacity: "10,000 mAh",
    price: 890,
    image: require('./pb6.jpg'),
    colors: ['#000000', COLORS.white],
    features: ['น้ำหนักเพียง 174 กรัม', 'รองรับ PD 20W', 'พกพาขึ้นเครื่องบินได้'],
    stock: 150,
    isNew: false,
  },
  {
    id: "p7",
    name: "Samsung Wireless Battery Pack",
    model: "EB-U3300",
    capacity: "10,000 mAh",
    price: 1590,
    image: require('./pb7.jpg'),
    colors: ['#E0E0E0'],
    features: ['ชาร์จไร้สาย 25W', 'รองรับอุปกรณ์ Qi', 'ดีไซน์เรียบหรู'],
    stock: 60,
    isNew: false,
  },
  {
    id: "p8",
    name: "Remax RPP-167",
    model: "RPP-167",
    capacity: "30,000 mAh",
    price: 790,
    image: require('./pb8.jpg'),
    colors: [COLORS.white, '#000000'],
    features: ['มีไฟฉายในตัว', 'จ่ายไฟเสถียร', 'หน้าจอตัวเลขดิจิตอล'],
    stock: 200,
    isNew: false,
  },
  {
    id: "p9",
    name: "Xiaomi Mi Power Bank 3 Pro",
    model: "PLM07ZM",
    capacity: "20,000 mAh",
    price: 1190,
    image: require('./pb9.jpg'),
    colors: ['#1E1E1E'],
    features: ['ชาร์จเร็วสองทิศทาง', 'พอร์ต USB-C 45W', 'ดีไซน์ผิวสัมผัสด้าน'],
    stock: 90,
    isNew: false,
  },
  {
    id: "p10",
    name: "Romoss Sense 8+",
    model: "PHP30 Pro",
    capacity: "30,000 mAh",
    price: 850,
    image: require('./pb10.jpg'),
    colors: [COLORS.white],
    features: ['รองรับ QC 3.0', 'มีพอร์ตชาร์จเข้า 3 แบบ', 'คุ้มค่าทนทาน'],
    stock: 110,
    isNew: false,
  }
];

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // 🟢 ทำระบบจำลองการ Fetch ข้อมูลให้ตรงกับสไลด์ของอาจารย์
  useEffect(() => {
    const loadData = async () => {
      try {
        // หน่วงเวลา 0.5 วินาที ให้เหมือนแอปกำลังโหลดข้อมูลจากเน็ต
        await new Promise(resolve => setTimeout(resolve, 500)); 
        setProducts(INITIAL_PRODUCTS);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };
    
    loadData();
  }, []);

  const addProduct = (newProduct: Product) => {
    setProducts(prev => [{ ...newProduct, isCustom: true }, ...prev]);
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const customProducts = products.filter(p => p.isCustom);

  return (
    <ProductsContext.Provider value={{ 
      products, 
      customProducts,
      addProduct, 
      removeProduct, 
      removeCustomProduct: removeProduct
    }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);