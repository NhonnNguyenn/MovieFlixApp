// src/screens/movie/MovieDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  ActivityIndicator,
  TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import api from '../../services/api';
import { MovieDetails } from '../../types/movie';
import { COLORS } from '../../constants';

type MovieDetailScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetail'>;
type MovieDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MovieDetail'>;

type Props = {
  route: MovieDetailScreenRouteProp;
  navigation: MovieDetailScreenNavigationProp;
};

export default function MovieDetailScreen({ route, navigation }: Props) {
  const { movieId } = route.params;
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMovieDetails();
  }, [movieId]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const details = await api.getMovieDetails(movieId);
      setMovieDetails(details);
    } catch (err) {
      setError('Không thể tải thông tin phim');
      console.error('Error loading movie details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={[COLORS.secondary, COLORS.background]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Đang tải thông tin phim...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error || !movieDetails) {
    return (
      <LinearGradient colors={[COLORS.secondary, COLORS.background]} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Lỗi</Text>
          <Text style={styles.errorMessage}>{error || 'Không tìm thấy thông tin phim'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMovieDetails}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const { movie, credits } = movieDetails;
  const mainCast = credits.cast.slice(0, 10);

  return (
    <LinearGradient colors={[COLORS.secondary, COLORS.background]} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Movie Poster and Basic Info */}
        <View style={styles.movieHeader}>
          <Image
            source={{ 
              uri: movie.backdrop_path 
                ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` 
                : 'https://via.placeholder.com/500x300/333/666?text=No+Backdrop'
            }}
            style={styles.backdrop}
          />
          <View style={styles.posterContainer}>
            <Image
              source={{ 
                uri: movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` 
                  : 'https://via.placeholder.com/300x450/333/666?text=No+Poster'
              }}
              style={styles.poster}
            />
          </View>
        </View>

        {/* Movie Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {movie.vote_average?.toFixed(1)}/10</Text>
            <Text style={styles.voteCount}>({movie.vote_count} lượt đánh giá)</Text>
          </View>
          
          <Text style={styles.releaseDate}>📅 {new Date(movie.release_date).toLocaleDateString('vi-VN')}</Text>
          
          {/* Sửa: Kiểm tra genres tồn tại trước khi render */}
          {movie.genres && movie.genres.length > 0 && (
            <View style={styles.genresContainer}>
              {movie.genres.map(genre => (
                <View key={genre.id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Thêm runtime nếu có */}
          {movie.runtime && (
            <Text style={styles.runtime}>⏱ {movie.runtime} phút</Text>
          )}
          
          {/* Thêm tagline nếu có */}
          {movie.tagline && (
            <Text style={styles.tagline}>"{movie.tagline}"</Text>
          )}
          
          <Text style={styles.overview}>{movie.overview}</Text>
        </View>

        {/* Cast Section */}
        {mainCast.length > 0 && (
          <View style={styles.castSection}>
            <Text style={styles.sectionTitle}>Diễn viên</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {mainCast.map(actor => (
                <View key={actor.id} style={styles.actorCard}>
                  <Image
                    source={{ 
                      uri: actor.profile_path 
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` 
                        : 'https://via.placeholder.com/100x150/333/666?text=No+Photo'
                    }}
                    style={styles.actorPhoto}
                  />
                  <Text style={styles.actorName} numberOfLines={2}>{actor.name}</Text>
                  <Text style={styles.actorCharacter} numberOfLines={2}>{actor.character}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
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
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  movieHeader: {
    position: 'relative',
    height: 250,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  posterContainer: {
    position: 'absolute',
    bottom: -50,
    left: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
  infoContainer: {
    marginTop: 60,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 8,
  },
  voteCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  releaseDate: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  runtime: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genreTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
  castSection: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  actorCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 100,
  },
  actorPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    backgroundColor: COLORS.textSecondary,
  },
  actorName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  actorCharacter: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  footer: {
    height: 40,
  },
});