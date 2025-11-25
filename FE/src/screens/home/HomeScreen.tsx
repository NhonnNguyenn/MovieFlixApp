// src/screens/home/HomeScreen.tsx - CẬP NHẬT
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import {
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MovieList from '../../components/movie/MovieList';
import { COLORS, FONTS, SHADOWS, SIZES } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MovieContext';
import { RootStackParamList } from '../../navigation/AppNavigator';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const { 
    popularMovies, 
    nowPlayingMovies, 
    topRatedMovies, 
    upcomingMovies, 
    loading, 
    error,
    refreshMovies 
  } = useMovies();

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [-50, 0],
    extrapolate: 'clamp',
  });

  const handleMoviePress = (movie: any) => {
    navigation.navigate('MovieDetail', { movieId: movie.id });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  if (error) {
    return (
      <LinearGradient colors={COLORS.gradientDark} style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="sad-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.errorTitle}>Lỗi tải dữ liệu</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshMovies}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[
        styles.animatedHeader,
        {
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslateY }]
        }
      ]}>
        <LinearGradient
          colors={[COLORS.overlayDark, 'transparent']}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>MovieFlix</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={refreshMovies}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Text style={styles.greeting}>{getGreeting()}! 👋</Text>
            <Text style={styles.username}>{user?.username}</Text>
            <Text style={styles.heroSubtitle}>Khám phá những bộ phim hay nhất</Text>
            
            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{popularMovies.length}+</Text>
                <Text style={styles.statLabel}>Phim hay</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{topRatedMovies.filter(m => m.vote_average > 8).length}+</Text>
                <Text style={styles.statLabel}>Đánh giá cao</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{upcomingMovies.length}+</Text>
                <Text style={styles.statLabel}>Sắp chiếu</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Featured Section */}
        {popularMovies.length > 0 && (
          <View style={styles.featuredSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Phổ biến</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <MovieList
              movies={popularMovies.slice(0, 10)}
              loading={loading}
              onMoviePress={handleMoviePress}
            />
          </View>
        )}

        {/* Now Playing */}
        {nowPlayingMovies.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎭 Đang chiếu</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <MovieList
              movies={nowPlayingMovies.slice(0, 10)}
              loading={loading}
              onMoviePress={handleMoviePress}
            />
          </View>
        )}

        {/* Top Rated */}
        {topRatedMovies.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⭐ Đánh giá cao</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <MovieList
              movies={topRatedMovies.slice(0, 10)}
              loading={loading}
              onMoviePress={handleMoviePress}
            />
          </View>
        )}

        {/* Upcoming */}
        {upcomingMovies.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📅 Sắp chiếu</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <MovieList
              movies={upcomingMovies.slice(0, 10)}
              loading={loading}
              onMoviePress={handleMoviePress}
            />
          </View>
        )}

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.overlayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 3,
    borderBottomLeftRadius: SIZES.radius * 2,
    borderBottomRightRadius: SIZES.radius * 2,
    ...SHADOWS.dark,
  },
  heroContent: {
    alignItems: 'flex-start',
  },
  greeting: {
    ...FONTS.h4,
    color: COLORS.text,
    opacity: 0.9,
    marginBottom: SIZES.base / 2,
  },
  username: {
    ...FONTS.h1,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: SIZES.base,
  },
  heroSubtitle: {
    ...FONTS.body2,
    color: COLORS.text,
    opacity: 0.8,
    marginBottom: SIZES.padding,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.overlay,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginTop: SIZES.base,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  statLabel: {
    ...FONTS.body4,
    color: COLORS.text,
    opacity: 0.8,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.text,
    opacity: 0.3,
    marginHorizontal: SIZES.base,
  },
  featuredSection: {
    marginTop: SIZES.padding,
  },
  section: {
    marginTop: SIZES.padding * 1.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  seeAllText: {
    ...FONTS.body2,
    color: COLORS.primary,
    fontWeight: '600',
  },
  footer: {
    height: SIZES.padding * 3,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  errorTitle: {
    ...FONTS.h3,
    color: COLORS.error,
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
  },
  errorMessage: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.base * 1.5,
    borderRadius: SIZES.radius,
  },
  retryButtonText: {
    ...FONTS.body2,
    color: COLORS.text,
    fontWeight: '600',
  },
});