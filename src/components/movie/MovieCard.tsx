// src/components/movie/MovieCard.tsx - TOÀN BỘ FILE ĐÃ SỬA
import React from 'react';
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Movie } from '../../types';
import { COLORS } from '../../constants';
import movieService from '../../services/movieService';

interface MovieCardProps {
  movie: Movie;
  onPress?: (movie: Movie) => void;
  size?: 'small' | 'medium' | 'large';
}

export default function MovieCard({ movie, onPress, size = 'medium' }: MovieCardProps) {
  const getCardSize = () => {
    switch (size) {
      case 'small': return { width: 120, height: 180 };
      case 'large': return { width: 160, height: 240 };
      default: return { width: 140, height: 210 };
    }
  };

  const getTitleSize = () => {
    switch (size) {
      case 'small': return 12;
      case 'large': return 14;
      default: return 13;
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress(movie);
    }
  };

  const getYear = () => {
    if (!movie.releaseDate) return 'N/A';
    try {
      return new Date(movie.releaseDate).getFullYear().toString();
    } catch {
      return 'N/A';
    }
  };

  const getRating = () => {
    return movie.voteAverage ? movie.voteAverage.toFixed(1) : 'N/A';
  };

  return (
    <TouchableOpacity 
      style={[styles.container, getCardSize()]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: movieService.getImageUrl(movie.posterPath) }}
        style={[styles.poster, getCardSize()]}
        resizeMode="cover"
      />
      
      {/* Rating Badge - ĐÃ SỬA LỖI */}
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={12} color={COLORS.accent} />
        <Text style={styles.rating}>{getRating()}</Text>
      </View>

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <Text 
          style={[styles.title, { fontSize: getTitleSize() }]} 
          numberOfLines={2}
        >
          {movie.title}
        </Text>
        
        <Text style={styles.year}>
          {getYear()}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 4,
    backgroundColor: COLORS.card,
  },
  poster: {
    borderRadius: 12,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    paddingTop: 20,
  },
  title: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  year: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  ratingContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.overlay,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rating: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
});