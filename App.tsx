// App.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import api from './src/services/api';
import { Movie } from './src/types/movie';

export default function App() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    const [popular, nowPlaying] = await Promise.all([
      api.getPopularMovies(),
      api.getNowPlayingMovies()
    ]);
    setPopularMovies(popular);
    setNowPlayingMovies(nowPlaying);
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const results = await api.searchMoviesAndActors(searchQuery);
      setSearchResults(results);
    }
  };

  const navigateToMovieDetail = (movieId: number) => {
    // Sẽ implement navigation sau
    console.log('Navigate to movie:', movieId);
  };

  const renderMovieCard = (movie: Movie) => (
    <TouchableOpacity 
      key={movie.id} 
      style={styles.movieCard}
      onPress={() => navigateToMovieDetail(movie.id)}
    >
      <Image
        source={{ uri: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450' }}
        style={styles.moviePoster}
        resizeMode="cover"
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>{movie.title}</Text>
        <Text style={styles.movieRating}>⭐ {movie.vote_average?.toFixed(1)}/10</Text>
        <Text style={styles.movieYear}>
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Search Results */}
        {searchResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kết quả tìm kiếm</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {searchResults.filter(item => item.media_type === 'movie').map(movie => renderMovieCard(movie))}
            </ScrollView>
          </View>
        )}

        {/* Popular Movies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Phổ biến</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularMovies.map(renderMovieCard)}
          </ScrollView>
        </View>

        {/* Now Playing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❤️ Đang chiếu</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {nowPlayingMovies.map(renderMovieCard)}
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
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchInput: {
    height: 40,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  movieCard: {
    width: 140,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moviePoster: {
    width: '100%',
    height: 200,
  },
  movieInfo: {
    padding: 10,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  movieRating: {
    fontSize: 12,
    color: '#f39c12',
  },
  movieYear: {
    fontSize: 12,
    color: '#666',
  },
});