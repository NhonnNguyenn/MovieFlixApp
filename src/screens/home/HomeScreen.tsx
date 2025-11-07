// src/screens/home/HomeScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MovieContext';
import { COLORS } from '../../constants';
import MovieList from '../../components/movie/MovieList';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { 
    popularMovies, 
    nowPlayingMovies, 
    topRatedMovies, 
    upcomingMovies, 
    loading, 
    error,
    refreshMovies 
  } = useMovies();

  const handleMoviePress = (movie: any) => {
    Alert.alert(
      'Movie Details', 
      `Bạn đã chọn: ${movie.title}\n\nTính năng chi tiết phim đang được phát triển!`
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng xuất', onPress: logout, style: 'destructive' },
      ]
    );
  };

  if (error) {
    return (
      <LinearGradient colors={[COLORS.secondary, COLORS.background]} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Lỗi tải dữ liệu</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[COLORS.secondary, COLORS.background]} style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={refreshMovies}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcome}>Chào mừng trở lại! 👋</Text>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.subtitle}>Khám phá những bộ phim hay nhất</Text>
        </View>

        {/* Movie Lists */}
        <MovieList
          title="🎬 Phổ biến"
          movies={popularMovies}
          loading={loading}
          onMoviePress={handleMoviePress}
        />

        <MovieList
          title="🎭 Đang chiếu"
          movies={nowPlayingMovies}
          loading={loading}
          onMoviePress={handleMoviePress}
        />

        <MovieList
          title="⭐ Đánh giá cao"
          movies={topRatedMovies}
          loading={loading}
          onMoviePress={handleMoviePress}
        />

        <MovieList
          title="📅 Sắp chiếu"
          movies={upcomingMovies}
          loading={loading}
          onMoviePress={handleMoviePress}
        />

        {/* Footer Space */}
        <View style={styles.footer} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  welcome: {
    fontSize: 24,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  username: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  footer: {
    height: 80,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});