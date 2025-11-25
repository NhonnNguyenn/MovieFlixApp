// src/components/movie/MovieList.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { COLORS } from '../../constants';

interface MovieListProps {
  title: string;
  movies: any[];
  loading?: boolean;
  onMoviePress: (movie: any) => void;
}

export default function MovieList({ title, movies, loading, onMoviePress }: MovieListProps) {
  console.log(`🎬 ${title} movies:`, movies?.length); // Debug
  
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <ActivityIndicator size="small" color={COLORS.primary} style={styles.loading} />
      </View>
    );
  }

  if (!movies || movies.length === 0) {
    console.log(`❌ ${title}: No movies to display`);
    return null;
  }

  const renderMovieCard = (movie: any) => {
    console.log('🎭 Movie data:', movie); // Debug movie data
    
    const posterUrl = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
      : 'https://via.placeholder.com/300x450/333/666?text=No+Poster';
    
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

    return (
      <TouchableOpacity 
        key={movie.id} 
        style={styles.movieCard}
        onPress={() => onMoviePress(movie)}
      >
        <Image
          source={{ uri: posterUrl }}
          style={styles.moviePoster}
          resizeMode="cover"
          onError={(e) => console.log('❌ Image load error:', movie.title)}
        />
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {movie.title || movie.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.movieRating}>⭐ {rating}/10</Text>
          </View>
          <Text style={styles.movieYear}>{year}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {movies.map(renderMovieCard)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    marginLeft: 24,
  },
  scrollView: {
    paddingLeft: 24,
  },
  scrollContent: {
    paddingRight: 24,
  },
  movieCard: {
    width: 150,
    marginRight: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  moviePoster: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.textMuted,
  },
  movieInfo: {
    padding: 12,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    height: 40,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  movieRating: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  movieYear: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  loading: {
    marginLeft: 24,
  },
});