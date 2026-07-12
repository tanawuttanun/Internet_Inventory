// app/_layout.tsx
// Layout หลักของแอป: ครอบ Provider ทั้งหมด + ตั้งค่า Tab Navigator
// และทำหน้าที่ auth-guard: ถ้ายังไม่ล็อกอิน จะเด้งไปหน้า /login เสมอ

import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { COLORS } from '../constants/theme';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { CartProvider, useCart } from '../context/CartContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { ProductsProvider } from '../context/ProductsContext';

function RootNavigator() {
  const { user, isLoading } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();
  const segments = useSegments();

  // --- Auth guard: สลับหน้าอัตโนมัติตามสถานะล็อกอิน ---
  useEffect(() => {
    if (isLoading) return;
    const onLoginScreen = segments[segments.length - 1] === 'login';

    if (!user && !onLoginScreen) {
      router.replace('/login');
    } else if (user && onLoginScreen) {
      router.replace('/');
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.gold,
          tabBarInactiveTintColor: 'rgba(255,255,255,0.55)',
          tabBarStyle: {
            backgroundColor: COLORS.navy,
            borderTopWidth: 0,
            height: 66,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'หน้าแรก',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="brand"
          options={{
            title: 'แบรนด์',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ribbon" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: 'เพิ่มสินค้า',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'รายการโปรด',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: 'ตะกร้า',
            tabBarBadge: totalItems > 0 ? totalItems : undefined,
            tabBarBadgeStyle: { backgroundColor: COLORS.gold, color: COLORS.navy },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart" size={size} color={color} />
            ),
          }}
        />
        {/* หน้า login ถูกซ่อนจาก tab bar แต่ยังอยู่ในกลุ่ม navigator เดียวกัน */}
        <Tabs.Screen
          name="login"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
      </Tabs>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <FavoritesProvider>
              <RootNavigator />
            </FavoritesProvider>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.navy,
  },
});
