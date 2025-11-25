// src/screens/movie/MovieDetailScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';
import { COLORS, FONTS, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/AppNavigator';
import api from '../../services/api';
import { MovieDetails, Video } from '../../types/movie';

type MovieDetailScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetail'>;
type MovieDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MovieDetail'>;

type Props = {
  route: MovieDetailScreenRouteProp;
  navigation: MovieDetailScreenNavigationProp;
};

const { width: screenWidth } = Dimensions.get('window');

export default function MovieDetailScreen({ route, navigation }: Props) {
  const { movieId } = route.params;
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trailerModalVisible, setTrailerModalVisible] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState<Video | null>(null);
  const [useWebView, setUseWebView] = useState(false);

  // Sửa navigation header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Quay lại', // Đảm bảo back title đúng
    });
  }, [navigation]);

  useEffect(() => {
    loadMovieDetails();
  }, [movieId]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🎬 Loading details for movie ID:', movieId);
      
      const details = await api.getMovieDetails(movieId);
      console.log('📊 Movie details response:', details);
      
      if (details) {
        setMovieDetails(details);
        console.log('🎥 Videos available:', details.videos?.length);
        console.log('🎯 Official trailer:', getOfficialTrailer(details.videos));
        
        // Auto fallback to WebView if YouTube iframe fails
        if (details.videos && details.videos.length > 0) {
          setUseWebView(true);
        }
      } else {
        setError('Không thể tải thông tin phim');
      }
    } catch (err) {
      setError('Không thể tải thông tin phim');
      console.error('❌ Error loading movie details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getOfficialTrailer = (videos: Video[]): Video | null => {
    if (!videos || videos.length === 0) {
      console.log('📭 No videos available');
      return null;
    }
    
    console.log('📹 Available videos:', videos.map(v => ({
      name: v.name,
      type: v.type,
      site: v.site,
      official: v.official
    })));
    
    // Ưu tiên trailer chính thức YouTube
    const officialTrailer = videos.find(video => 
      video.type === 'Trailer' && 
      video.official === true &&
      video.site === 'YouTube'
    );
    
    // Fallback: bất kỳ trailer YouTube nào
    const anyYouTubeTrailer = videos.find(video => 
      video.type === 'Trailer' && 
      video.site === 'YouTube'
    );
    
    // Fallback: bất kỳ video YouTube nào
    const anyYouTubeVideo = videos.find(video => 
      video.site === 'YouTube'
    );
    
    const result = officialTrailer || anyYouTubeTrailer || anyYouTubeVideo;
    console.log('🎯 Selected trailer:', result);
    return result;
  };

  const openTrailer = (trailer: Video) => {
    if (trailer.site === 'YouTube') {
      setSelectedTrailer(trailer);
      setTrailerModalVisible(true);
    } else {
      console.log('❌ Unsupported video site:', trailer.site);
    }
  };

  const closeTrailerModal = () => {
    setTrailerModalVisible(false);
    setSelectedTrailer(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải thông tin phim...</Text>
      </View>
    );
  }

  if (error || !movieDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Lỗi</Text>
        <Text style={styles.errorMessage}>{error || 'Không tìm thấy thông tin phim'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadMovieDetails}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { movie, credits, videos } = movieDetails;
  const mainCast = credits.cast?.slice(0, 10) || [];
  const officialTrailer = getOfficialTrailer(videos);
  const trailerVideos = videos?.filter(v => v.type === 'Trailer' && v.site === 'YouTube') || [];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Movie Header với Trailer Button */}
        <View style={styles.movieHeader}>
          <Image
            source={{ 
              uri: movie.backdrop_path 
                ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` 
                : 'https://via.placeholder.com/500x300/333/666?text=No+Backdrop'
            }}
            style={styles.backdrop}
          />
          
          {officialTrailer && (
            <TouchableOpacity 
              style={styles.trailerButton}
              onPress={() => openTrailer(officialTrailer)}
            >
              <Ionicons name="play-circle" size={32} color={COLORS.text} />
              <Text style={styles.trailerButtonText}>Xem Trailer</Text>
            </TouchableOpacity>
          )}
          
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
            <Text style={styles.rating}>⭐ {movie.vote_average?.toFixed(1) || 'N/A'}/10</Text>
            <Text style={styles.voteCount}>({movie.vote_count || 0} lượt đánh giá)</Text>
          </View>
          
          <Text style={styles.releaseDate}>📅 {movie.release_date ? new Date(movie.release_date).toLocaleDateString('vi-VN') : 'Chưa công bố'}</Text>
          
          {movie.genres && movie.genres.length > 0 && (
            <View style={styles.genresContainer}>
              {movie.genres.map(genre => (
                <View key={genre.id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          )}
          
          {movie.runtime && (
            <Text style={styles.runtime}>⏱ {movie.runtime} phút</Text>
          )}
          
          {movie.tagline && (
            <Text style={styles.tagline}>"{movie.tagline}"</Text>
          )}
          
          <Text style={styles.overview}>{movie.overview || 'Không có mô tả.'}</Text>
        </View>

        {/* Trailers Section */}
        {trailerVideos.length > 0 && (
          <View style={styles.trailersSection}>
            <Text style={styles.sectionTitle}>Trailers ({trailerVideos.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {trailerVideos.map(trailer => (
                <TouchableOpacity 
                  key={trailer.id}
                  style={styles.trailerCard}
                  onPress={() => openTrailer(trailer)}
                >
                  <View style={styles.trailerThumbnail}>
                    <Ionicons name="play-circle" size={24} color={COLORS.text} />
                    <Image
                      source={{ uri: `https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg` }}
                      style={styles.trailerImage}
                    />
                  </View>
                  <Text style={styles.trailerName} numberOfLines={2}>
                    {trailer.name}
                  </Text>
                  {trailer.official && (
                    <Text style={styles.officialBadge}>Chính thức</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

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
        
        <View style={styles.footer} />
      </ScrollView>

      {/* Trailer Modal */}
      <Modal
        visible={trailerModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeTrailerModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeTrailerModal} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={2}>
              {selectedTrailer?.name || 'Trailer'}
            </Text>
          </View>
          
          {selectedTrailer && (
            <View style={styles.videoContainer}>
              {useWebView ? (
                <WebView
                  style={styles.webview}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowsFullscreenVideo={true}
                  source={{
                    uri: `https://www.youtube.com/embed/${selectedTrailer.key}?autoplay=1&playsinline=1`,
                  }}
                />
              ) : (
                <YoutubePlayer
                  height={300}
                  play={true}
                  videoId={selectedTrailer.key}
                  webViewStyle={{ borderRadius: 0 }}
                  webViewProps={{
                    allowsFullscreenVideo: true,
                  }}
                />
              )}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginTop: SIZES.base,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: SIZES.padding,
    backgroundColor: COLORS.background,
  },
  errorTitle: {
    ...FONTS.h3,
    color: COLORS.error,
    marginBottom: SIZES.base,
  },
  errorMessage: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center' as const,
    marginBottom: SIZES.padding,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 1.5,
    paddingVertical: SIZES.base * 1.5,
    borderRadius: SIZES.radius,
  },
  retryButtonText: {
    ...FONTS.body2,
    color: COLORS.text,
    fontWeight: '600' as const,
  },
  movieHeader: {
    position: 'relative' as const,
    height: 250,
  },
  backdrop: {
    width: screenWidth,
    height: 250,
    resizeMode: 'cover' as const,
  },
  trailerButton: {
    position: 'absolute' as const,
    top: 100,
    left: screenWidth / 2 - 80,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  trailerButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  posterContainer: {
    position: 'absolute' as const,
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
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: COLORS.text,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  rating: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '600' as const,
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
    fontStyle: 'italic' as const,
    color: COLORS.textSecondary,
    marginBottom: 16,
    textAlign: 'center' as const,
  },
  genresContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
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
    fontWeight: '600' as const,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
  trailersSection: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold' as const,
    color: COLORS.text,
    marginBottom: 16,
    marginLeft: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    paddingLeft: 12,
  },
  trailerCard: {
    width: 160,
    marginRight: 12,
  },
  trailerThumbnail: {
    width: 160,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#333',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
    overflow: 'hidden' as const,
    position: 'relative' as const,
  },
  trailerImage: {
    width: 160,
    height: 90,
    position: 'absolute' as const,
    opacity: 0.7,
  },
  trailerName: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center' as const,
    marginBottom: 4,
  },
  officialBadge: {
    fontSize: 10,
    color: COLORS.primary,
    textAlign: 'center' as const,
    fontWeight: '600' as const,
  },
  castSection: {
    padding: 20,
    marginTop: 20,
  },
  actorCard: {
    alignItems: 'center' as const,
    marginRight: 16,
    width: 80,
  },
  actorPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    backgroundColor: COLORS.textSecondary,
  },
  actorName: {
    fontSize: 11,
    fontWeight: 'bold' as const,
    color: COLORS.text,
    textAlign: 'center' as const,
  },
  actorCharacter: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center' as const,
  },
  footer: {
    height: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 16,
    paddingTop: 60,
    backgroundColor: COLORS.secondary,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: COLORS.text,
    marginHorizontal: 16,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
};