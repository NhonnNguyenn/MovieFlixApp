// src/screens/profile/ProfileScreen.tsx - CẬP NHẬT
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { COLORS, FONTS, SHADOWS, SIZES } from '../../constants';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Đăng xuất', 
          onPress: logout, 
          style: 'destructive' 
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'heart',
      title: 'Phim yêu thích',
      description: 'Xem danh sách phim bạn đã yêu thích',
      color: COLORS.error,
      onPress: () => console.log('Favorites pressed'),
    },
    {
      icon: 'star',
      title: 'Đánh giá của tôi',
      description: 'Xem và quản lý đánh giá phim',
      color: COLORS.accent,
      onPress: () => console.log('Ratings pressed'),
    },
    {
      icon: 'time',
      title: 'Lịch sử xem',
      description: 'Xem lại các phim đã xem',
      color: COLORS.info,
      onPress: () => console.log('History pressed'),
    },
    {
      icon: 'settings',
      title: 'Cài đặt',
      description: 'Tùy chỉnh ứng dụng',
      color: COLORS.textSecondary,
      onPress: () => console.log('Settings pressed'),
    },
  ];

  const stats = [
    { label: 'Phim đã xem', value: '24', icon: 'film' },
    { label: 'Đánh giá', value: '18', icon: 'star' },
    { label: 'Ngày tham gia', value: '45', icon: 'calendar' },
  ];

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[
        styles.animatedHeader,
        {
          opacity: headerOpacity,
        }
      ]}>
        <LinearGradient
          colors={[COLORS.overlayDark, 'transparent']}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Hồ sơ</Text>
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        
        {/* Profile Header */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.profileHeader}
        >
          <View style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[COLORS.accent, COLORS.accentDark]}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </LinearGradient>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              </View>
            </View>
            
            <Text style={styles.userName}>{user?.username || 'Người dùng'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            <Text style={styles.joinDate}>Thành viên từ tháng 1, 2024</Text>
          </View>
        </LinearGradient>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          {stats.map((stat, index) => (
            <View key={stat.label} style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name={stat.icon as any} size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              {index < stats.length - 1 && <View style={styles.statDivider} />}
            </View>
          ))}
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Tài khoản</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={item.title}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.lastMenuItem
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info Section */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appInfoTitle}>Ứng dụng</Text>
          <View style={styles.appInfoItem}>
            <Ionicons name="information-circle" size={20} color={COLORS.info} />
            <Text style={styles.appInfoText}>Phiên bản 1.0.0</Text>
          </View>
          <View style={styles.appInfoItem}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
            <Text style={styles.appInfoText}>Bảo mật & Quyền riêng tư</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* Footer Space */}
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: SIZES.padding * 2,
  },
  headerGradient: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 3,
    borderBottomLeftRadius: SIZES.radius * 2,
    borderBottomRightRadius: SIZES.radius * 2,
  },
  profileContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SIZES.padding,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.dark,
  },
  avatarText: {
    ...FONTS.h1,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 2,
  },
  userName: {
    ...FONTS.h1,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
  },
  userEmail: {
    ...FONTS.body2,
    color: COLORS.text,
    opacity: 0.9,
    marginBottom: SIZES.base / 2,
  },
  joinDate: {
    ...FONTS.body3,
    color: COLORS.text,
    opacity: 0.7,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.medium,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  statValue: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },
  statDivider: {
    position: 'absolute',
    right: 0,
    top: '25%',
    bottom: '25%',
    width: 1,
    backgroundColor: COLORS.textMuted,
    opacity: 0.3,
  },
  menuSection: {
    backgroundColor: COLORS.surface,
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  menuTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    fontWeight: 'bold',
    padding: SIZES.padding,
    paddingBottom: SIZES.base,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textMuted + '20',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    ...FONTS.body2,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuItemDescription: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },
  appInfoSection: {
    backgroundColor: COLORS.surface,
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.medium,
  },
  appInfoTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: SIZES.padding,
  },
  appInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base,
  },
  appInfoText: {
    ...FONTS.body2,
    color: COLORS.text,
    marginLeft: SIZES.padding,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error + '20',
    margin: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.error,
    ...SHADOWS.medium,
  },
  logoutText: {
    ...FONTS.body2,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: SIZES.base,
  },
  footer: {
    height: SIZES.padding * 3,
  },
});