// src/components/movie/MovieList.tsx - CẬP NHẬT
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants';
import MovieCard from './MovieCard';

interface MovieListProps {
  title?: string;
  movies: any[];
  loading?: boolean;
  onMoviePress: (movie: any) => void;
  showAllButton?: boolean;
  onShowAllPress?: () => void;
}

export default function MovieList({ 
  title, 
  movies, 
  loading, 
  onMoviePress,
  showAllButton = false,
  onShowAllPress 
}: MovieListProps) {
  
  if (loading) {
    return (
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loading} />
      </View>
    );
  }

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {showAllButton && (
            <TouchableOpacity onPress={onShowAllPress}>
              <Text style={styles.showAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onPress={onMoviePress}
            size={index === 0 ? 'large' : 'medium'}
          />
        ))}
        
        {/* Add some extra space at the end */}
        <View style={styles.extraSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.padding * 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  showAllText: {
    ...FONTS.body2,
    color: COLORS.primary,
    fontWeight: '600',
  },
  scrollView: {
    paddingLeft: SIZES.padding,
  },
  scrollContent: {
    paddingRight: SIZES.padding,
  },
  loading: {
    marginLeft: SIZES.padding,
    marginTop: SIZES.padding,
  },
  extraSpace: {
    width: SIZES.padding,
  },
});