// src/app/finances.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BRAND, COLORS, RADIUS, SPACING } from '../constants/theme';

export default function FinancesScreen() {
  const router = useRouter();

  // ข้อมูลจำลองสำหรับแสดงในหน้าการเงิน
  const transactions = [
    { id: '1', type: 'income', title: 'ขาย PowerPay Pro Ultra (x2)', date: 'วันนี้, 14:30', amount: 3980 },
    { id: '2', type: 'income', title: 'ขาย PowerPay Slim Gold (x1)', date: 'วันนี้, 10:15', amount: 890 },
    { id: '3', type: 'expense', title: 'ค่าจัดส่งสินค้า (Kerry)', date: 'เมื่อวาน, 16:00', amount: -150 },
    { id: '4', type: 'income', title: 'ขาย PowerPay Pro Ultra (x1)', date: 'เมื่อวาน, 09:20', amount: 1990 },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finances</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* บัตรสรุปยอดรวม (Total Balance Card) */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>ยอดเงินสะสมทั้งหมด</Text>
          <Text style={styles.balanceAmount}>{BRAND.currency}6,710.00</Text>
          <View style={styles.balanceStatsRow}>
            <View style={styles.statBox}>
              <Ionicons name="arrow-up-circle" size={16} color={COLORS.success} />
              <Text style={styles.statText}>รายรับ: ฿6,860</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="arrow-down-circle" size={16} color={COLORS.danger} />
              <Text style={styles.statText}>รายจ่าย: ฿150</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        {/* รายการธุรกรรม */}
        <View style={styles.listCard}>
          {transactions.map((t, index) => (
            <View key={t.id} style={[styles.transactionRow, index === transactions.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={[styles.iconWrap, { backgroundColor: t.type === 'income' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 75, 75, 0.15)' }]}>
                <Ionicons name={t.type === 'income' ? 'cash' : 'card'} size={20} color={t.type === 'income' ? COLORS.success : COLORS.danger} />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle} numberOfLines={1}>{t.title}</Text>
                <Text style={styles.transactionDate}>{t.date}</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: t.type === 'income' ? COLORS.success : COLORS.navy }]}>
                {t.type === 'income' ? '+' : ''}{t.amount.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: { marginRight: SPACING.md },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.navy },
  container: { padding: SPACING.lg },
  
  balanceCard: {
    backgroundColor: COLORS.navyDark, padding: SPACING.xl,
    borderRadius: RADIUS.lg, marginBottom: SPACING.xl,
    shadowColor: COLORS.navy, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 5,
  },
  balanceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 4 },
  balanceAmount: { color: COLORS.gold, fontSize: 36, fontWeight: '800', marginBottom: SPACING.lg },
  balanceStatsRow: { flexDirection: 'row', gap: SPACING.lg },
  statBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.sm },
  statText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.navy, marginBottom: SPACING.sm, marginLeft: 4 },
  listCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: SPACING.sm },
  transactionRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.offWhite },
  iconWrap: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  transactionInfo: { flex: 1 },
  transactionTitle: { fontSize: 14, fontWeight: '600', color: COLORS.navy, marginBottom: 2 },
  transactionDate: { fontSize: 12, color: COLORS.grayText },
  transactionAmount: { fontSize: 15, fontWeight: '800' },
});