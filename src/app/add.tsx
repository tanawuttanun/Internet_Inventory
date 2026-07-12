// app/add.tsx
// หน้าเพิ่มสินค้าใหม่ (สำหรับแอดมิน/ผู้ขายของร้าน)
// เมื่อเพิ่มสำเร็จ สินค้าจะไปโผล่ที่หน้าแรกทันที (ผ่าน ProductsContext)

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Product } from '../constants/products';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { useProducts } from '../context/ProductsContext';

const COLOR_OPTIONS = [
  { label: 'น้ำเงิน', value: COLORS.navy },
  { label: 'ทอง', value: COLORS.gold },
  { label: 'ขาว', value: COLORS.white },
];

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80';

export default function AddProductScreen() {
  const { addProduct, customProducts, removeCustomProduct } = useProducts();
  const router = useRouter();

  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [features, setFeatures] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([COLORS.navy]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleColor = (value: string) => {
    setSelectedColors((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'กรุณากรอกชื่อสินค้า';
    if (!capacity.trim()) e.capacity = 'กรุณากรอกความจุแบตเตอรี่ เช่น 10,000mAh';

    const priceNum = Number(price);
    if (!price.trim() || isNaN(priceNum) || priceNum <= 0) {
      e.price = 'ราคาต้องเป็นตัวเลขมากกว่า 0';
    }

    const stockNum = Number(stock);
    if (!stock.trim() || isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
      e.stock = 'จำนวนสต๊อกต้องเป็นจำนวนเต็มไม่ติดลบ';
    }

    if (selectedColors.length === 0) e.colors = 'เลือกอย่างน้อย 1 สี';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setName('');
    setModel('');
    setCapacity('');
    setPrice('');
    setStock('');
    setImage('');
    setFeatures('');
    setSelectedColors([COLORS.navy]);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const newProduct: Product = {
      id: 'custom-' + Date.now(),
      name: name.trim(),
      model: model.trim() || 'PP-CUSTOM',
      capacity: capacity.trim(),
      price: Math.round(Number(price)),
      image: image.trim() || DEFAULT_IMAGE,
      colors: selectedColors,
      features: features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
      rating: 0,
      reviews: 0,
      stock: Math.round(Number(stock)),
      isNew: true,
    };

    await addProduct(newProduct);
    Alert.alert('สำเร็จ', `เพิ่มสินค้า "${newProduct.name}" เรียบร้อยแล้ว`, [
      { text: 'ดูที่หน้าแรก', onPress: () => router.push('/') },
      { text: 'เพิ่มอีก', onPress: resetForm, style: 'cancel' },
    ]);
    resetForm();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>เพิ่มสินค้าใหม่</Text>
        <Text style={styles.subtitle}>
          สำหรับผู้ดูแลร้าน — เพิ่มพาวเวอร์แบงก์รุ่นใหม่เข้าสู่แคตตาล็อก
        </Text>

        <Field label="ชื่อสินค้า *" error={errors.name}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="เช่น PowerPay Ultra"
            placeholderTextColor={COLORS.grayText}
          />
        </Field>

        <Field label="รหัสรุ่น">
          <TextInput
            style={styles.input}
            value={model}
            onChangeText={setModel}
            placeholder="เช่น PP-U40"
            placeholderTextColor={COLORS.grayText}
          />
        </Field>

        <Field label="ความจุแบตเตอรี่ *" error={errors.capacity}>
          <TextInput
            style={styles.input}
            value={capacity}
            onChangeText={setCapacity}
            placeholder="เช่น 40,000mAh"
            placeholderTextColor={COLORS.grayText}
          />
        </Field>

        <View style={styles.row}>
          <Field label="ราคา (บาท) *" error={errors.price} style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="1990"
              placeholderTextColor={COLORS.grayText}
              keyboardType="numeric"
            />
          </Field>
          <View style={{ width: SPACING.md }} />
          <Field label="สต๊อก (ชิ้น) *" error={errors.stock} style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              value={stock}
              onChangeText={setStock}
              placeholder="50"
              placeholderTextColor={COLORS.grayText}
              keyboardType="numeric"
            />
          </Field>
        </View>

        <Field label="ลิงก์รูปภาพ (ถ้าไม่ใส่จะใช้รูปตัวอย่าง)">
          <TextInput
            style={styles.input}
            value={image}
            onChangeText={setImage}
            placeholder="https://..."
            placeholderTextColor={COLORS.grayText}
            autoCapitalize="none"
          />
        </Field>

        {!!(image || true) && (
          <Image source={{ uri: image.trim() || DEFAULT_IMAGE }} style={styles.preview} />
        )}

        <Field label="จุดเด่นสินค้า (1 บรรทัดต่อ 1 ข้อ)">
          <TextInput
            style={[styles.input, styles.textArea]}
            value={features}
            onChangeText={setFeatures}
            placeholder={'ชาร์จเร็ว 65W\nตัวถังอลูมิเนียม\nจอดิจิตอลแสดงเปอร์เซ็นต์'}
            placeholderTextColor={COLORS.grayText}
            multiline
            numberOfLines={4}
          />
        </Field>

        <Text style={styles.label}>สีที่มีจำหน่าย *</Text>
        <View style={styles.colorOptionRow}>
          {COLOR_OPTIONS.map((c) => {
            const active = selectedColors.includes(c.value);
            return (
              <TouchableOpacity
                key={c.value}
                style={[styles.colorOption, active && styles.colorOptionActive]}
                onPress={() => toggleColor(c.value)}
              >
                <View style={[styles.colorSwatch, { backgroundColor: c.value }]} />
                <Text style={styles.colorOptionText}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {!!errors.colors && <Text style={styles.errorText}>{errors.colors}</Text>}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Ionicons name="add-circle" size={18} color={COLORS.navy} />
          <Text style={styles.submitText}>เพิ่มสินค้าเข้าแคตตาล็อก</Text>
        </TouchableOpacity>

        {customProducts.length > 0 && (
          <View style={styles.customSection}>
            <Text style={styles.label}>สินค้าที่เพิ่มโดยคุณ ({customProducts.length})</Text>
            {customProducts.map((p) => (
              <View key={p.id} style={styles.customItem}>
                <Text style={styles.customItemName} numberOfLines={1}>
                  {p.name}
                </Text>
                <TouchableOpacity onPress={() => removeCustomProduct(p.id)}>
                  <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({
  label,
  error,
  children,
  style,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <View style={[{ marginBottom: SPACING.md }, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  scroll: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.navy },
  subtitle: { fontSize: 12, color: COLORS.grayText, marginTop: 4, marginBottom: SPACING.lg },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.navy, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 46,
    color: COLORS.navy,
    fontSize: 14,
  },
  textArea: { height: 90, paddingTop: 10, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  errorText: { color: COLORS.danger, fontSize: 11, marginTop: 4 },
  preview: {
    width: '100%',
    height: 140,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    resizeMode: 'cover',
  },
  colorOptionRow: { flexDirection: 'row', gap: 10, marginBottom: SPACING.sm },
  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  colorOptionActive: { borderColor: COLORS.gold, backgroundColor: '#FFF8E7' },
  colorSwatch: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: COLORS.border },
  colorOptionText: { fontSize: 12, color: COLORS.navy },
  submitBtn: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: COLORS.gold,
    borderRadius: RADIUS.sm,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  submitText: { color: COLORS.navy, fontWeight: '800', fontSize: 14 },
  customSection: { marginTop: SPACING.xl },
  customItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginBottom: 8,
  },
  customItemName: { flex: 1, fontSize: 13, color: COLORS.navy, marginRight: 8 },
});
