// src/components/movie/MovieList.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { COLORS } from '../../constants';
import MovieCard from './MovieCard';
import { Movie } from '../../types';

interface MovieListProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  onMoviePress?: (movie: Movie) => void;
}

export default function MovieList({ 
  title, 
  movies, 
  loading = false, 
  onMoviePress 
}: MovieListProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      </View>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onPress={onMoviePress}
            size="medium"
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    marginLeft: 16,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  loadingContainer: {
    height: 210,
    justifyContent: 'center',
    alignItems: 'center',
  },
});