// src/screens/movie/MovieDetailScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Movie } from '../../types';
import { COLORS } from '../../constants';
import movieService from '../../services/movieService';

export default function MovieDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { movie } = route.params as { movie: Movie };

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePlayTrailer = () => {
    Alert.alert('Trailer', 'Tính năng phát trailer đang được phát triển!');
  };

  const handleAddToFavorites = () => {
    Alert.alert('Yêu thích', 'Đã thêm vào danh sách yêu thích!');
  };

  return (
    <View style={styles.container}>
      {/* Backdrop Image */}
      <Image
        source={{ uri: movieService.getImageUrl(movie.backdropPath, 'w780') }}
        style={styles.backdrop}
        resizeMode="cover"
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)', COLORS.background]}
        style={styles.gradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết phim</Text>
        <TouchableOpacity onPress={handleAddToFavorites} style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Movie Info */}
        <View style={styles.movieInfo}>
          <Image
            source={{ uri: movieService.getImageUrl(movie.posterPath, 'w500') }}
            style={styles.poster}
            resizeMode="cover"
          />
          
          <View style={styles.movieDetails}>
            <Text style={styles.title}>{movie.title}</Text>
            
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color={COLORS.accent} />
              <Text style={styles.rating}>{movie.voteAverage?.toFixed(1) || 'N/A'}</Text>
              <Text style={styles.voteCount}>({movie.voteCount} đánh giá)</Text>
            </View>

            <Text style={styles.releaseDate}>
              {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
            </Text>

            <TouchableOpacity style={styles.playButton} onPress={handlePlayTrailer}>
              <Ionicons name="play" size={20} color={COLORS.text} />
              <Text style={styles.playButtonText}>Xem trailer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nội dung</Text>
          <Text style={styles.overview}>
            {movie.overview || 'Đang cập nhật nội dung...'}
          </Text>
        </View>

        {/* Additional Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin thêm</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngôn ngữ:</Text>
            <Text style={styles.infoValue}>Tiếng Anh</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái:</Text>
            <Text style={styles.infoValue}>Đã phát hành</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Độ nổi tiếng:</Text>
            <Text style={styles.infoValue}>{movie.voteCount}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backdrop: {
    width: '100%',
    height: 250,
    position: 'absolute',
    top: 0,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  favoriteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    marginTop: 150,
  },
  movieInfo: {
    flexDirection: 'row',
    padding: 16,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
  movieDetails: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 4,
    marginRight: 8,
  },
  voteCount: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  releaseDate: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: 16,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.secondaryLight,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  overview: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  infoValue: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
});