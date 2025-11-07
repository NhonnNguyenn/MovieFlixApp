// App.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import api from './src/services/api';
import { Movie } from './src/types/movie';

export default function App() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      console.log('🔄 Đang tải danh sách phim...');
      
      const [popular, nowPlaying] = await Promise.all([
        api.getPopularMovies(),
        api.getNowPlayingMovies()
      ]);
      
      console.log('📊 Phim phổ biến:', popular.length);
      console.log('🎬 Phim đang chiếu:', nowPlaying.length);
      
      setPopularMovies(popular);
      setNowPlayingMovies(nowPlaying);
      
    } catch (error) {
      console.error('❌ Lỗi tải phim:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách phim');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      console.log('🔍 Đang tìm kiếm:', query);
      
      const results = await api.searchMoviesAndActors(query);
      console.log('📋 Kết quả tìm kiếm:', results);
      
      setSearchResults(results);
      
    } catch (error) {
      console.error('❌ Lỗi tìm kiếm:', error);
      Alert.alert('Lỗi', 'Không thể tìm kiếm');
    } finally {
      setSearchLoading(false);
    }
  };

  const navigateToMovieDetail = (movieId: number) => {
    console.log('🎯 Chuyển đến phim:', movieId);
    // Sẽ implement navigation sau
  };

  const renderMovieCard = (movie: any) => {
    const posterUrl = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
      : 'https://via.placeholder.com/300x450/cccccc/969696?text=No+Poster';
    
    console.log('🖼 Poster URL:', posterUrl); // Debug image URLs
    
    return (
      <TouchableOpacity 
        key={movie.id} 
        style={styles.movieCard}
        onPress={() => navigateToMovieDetail(movie.id)}
      >
        <Image
          source={{ uri: posterUrl }}
          style={styles.moviePoster}
          resizeMode="cover"
          onError={(e) => console.log('❌ Lỗi tải ảnh:', movie.title, e.nativeEvent.error)}
        />
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {movie.title || movie.name}
          </Text>
          <Text style={styles.movieRating}>
            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}/10
          </Text>
          <Text style={styles.movieYear}>
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 
             movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : 'N/A'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderActorCard = (actor: any) => {
    const profileUrl = actor.profile_path 
      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
      : 'https://via.placeholder.com/200x300/cccccc/969696?text=No+Photo';
    
    return (
      <View key={actor.id} style={styles.actorCard}>
        <Image
          source={{ uri: profileUrl }}
          style={styles.actorPhoto}
          resizeMode="cover"
        />
        <View style={styles.actorInfo}>
          <Text style={styles.actorName} numberOfLines={2}>{actor.name}</Text>
          <Text style={styles.actorKnownFor} numberOfLines={1}>
            {actor.known_for_department}
          </Text>
        </View>
      </View>
    );
  };

  // Hiển thị loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Đang tải danh sách phim...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Khám phá những bộ phim hay nhất</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm phim, diễn viên..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Results */}
        {searchResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kết quả tìm kiếm</Text>
            {searchLoading && (
              <ActivityIndicator size="small" color="#667eea" style={styles.searchLoading} />
            )}
            
            {/* Movies from search */}
            {searchResults.filter(item => item.media_type === 'movie').length > 0 && (
              <>
                <Text style={styles.subSectionTitle}>Phim</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  {searchResults
                    .filter(item => item.media_type === 'movie')
                    .map(renderMovieCard)}
                </ScrollView>
              </>
            )}
            
            {/* Actors from search */}
            {searchResults.filter(item => item.media_type === 'person').length > 0 && (
              <>
                <Text style={styles.subSectionTitle}>Diễn viên</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  {searchResults
                    .filter(item => item.media_type === 'person')
                    .map(renderActorCard)}
                </ScrollView>
              </>
            )}
          </View>
        )}

        {/* Popular Movies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Phổ biến</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {popularMovies.length > 0 ? (
              popularMovies.map(renderMovieCard)
            ) : (
              <Text style={styles.emptyText}>Không có phim nào</Text>
            )}
          </ScrollView>
        </View>

        {/* Now Playing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❤️ Đang chiếu</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {nowPlayingMovies.length > 0 ? (
              nowPlayingMovies.map(renderMovieCard)
            ) : (
              <Text style={styles.emptyText}>Không có phim nào</Text>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  searchButton: {
    padding: 5,
  },
  searchButtonText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#666',
    marginTop: 5,
  },
  horizontalScroll: {
    marginHorizontal: -15,
    paddingHorizontal: 15,
  },
  movieCard: {
    width: 140,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  moviePoster: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0', // Background khi đang tải
  },
  movieInfo: {
    padding: 12,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  movieRating: {
    fontSize: 12,
    color: '#f39c12',
    fontWeight: '600',
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 12,
    color: '#666',
  },
  actorCard: {
    width: 120,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  actorPhoto: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  actorInfo: {
    padding: 10,
  },
  actorName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  actorKnownFor: {
    fontSize: 11,
    color: '#667eea',
    textAlign: 'center',
    marginTop: 2,
  },
  searchLoading: {
    marginVertical: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    padding: 20,
  },
});