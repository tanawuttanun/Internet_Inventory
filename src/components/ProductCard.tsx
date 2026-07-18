// src/components/ProductCard.tsx
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { useFavorites } from '../context/FavoritesContext';

export default function ProductCard({ 
  product, onPress, isAdmin, onDelete 
}: { 
  product: any; onPress: () => void; isAdmin?: boolean; onDelete?: () => void;
}) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFav = favoriteIds?.includes(product.id);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      
      {/* 🔴 ปุ่มลบสินค้า (โชว์เฉพาะ Admin) */}
      {isAdmin && (
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={(e) => {
            e.stopPropagation(); // กันไม่ให้กดแล้วเด้งไปหน้าดูรายละเอียดสินค้า
            if (onDelete) onDelete();
          }}
        >
          <Ionicons name="trash" size={16} color={COLORS.white} />
        </TouchableOpacity>
      )}

      {/* 🤍 ปุ่มกดหัวใจ */}
      <TouchableOpacity
        style={styles.favBtn}
        onPress={(e) => {
          e.stopPropagation(); 
          toggleFavorite(product.id);
        }}
      >
        <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={20} color={isFav ? '#FF4B4B' : COLORS.grayText} />
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {/* 💡 แก้ไขตรงนี้: ลบ { uri: ... } ออก เพื่อให้รองรับไฟล์ require() จากในเครื่อง */}
        <Image source={product.image} style={styles.image} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.capacity}>{product.capacity}</Text>
        <Text style={styles.price}>฿{product.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%', backgroundColor: COLORS.white, borderRadius: RADIUS.md,
    padding: SPACING.sm, marginBottom: SPACING.md, borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)', shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  deleteBtn: {
    position: 'absolute', top: 8, left: 8, zIndex: 10,
    backgroundColor: COLORS.danger, borderRadius: 16, width: 32, height: 32,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2,
  },
  favBtn: {
    position: 'absolute', top: 8, right: 8, zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 16, width: 32, height: 32,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
  },
  imageContainer: {
    width: '100%', aspectRatio: 1, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.offWhite, overflow: 'hidden', marginBottom: SPACING.sm,
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  info: { gap: 2 },
  name: { fontSize: 14, fontWeight: '700', color: COLORS.navy },
  capacity: { fontSize: 11, color: COLORS.grayText },
  price: { fontSize: 16, fontWeight: '800', color: '#B8860B', marginTop: 4 },
});