// src/components/movie/MovieCard.tsx - CẬP NHẬT
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { COLORS, FONTS, SHADOWS, SIZES } from '../../constants';
import movieService from '../../services/movieService';
import { Movie } from '../../types';

interface MovieCardProps {
  movie: Movie;
  onPress?: (movie: Movie) => void;
  size?: 'small' | 'medium' | 'large';
}

export default function MovieCard({ movie, onPress, size = 'medium' }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);

  const getCardSize = () => {
    switch (size) {
      case 'small': return { width: 120, height: 180 };
      case 'large': return { width: 160, height: 240 };
      default: return { width: 140, height: 210 };
    }
  };

  const getTitleSize = () => {
    switch (size) {
      case 'small': return FONTS.body4.fontSize;
      case 'large': return FONTS.body2.fontSize;
      default: return FONTS.body3.fontSize;
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress(movie);
    }
  };

  const getYear = () => {
    if (!movie.release_date) return 'N/A';
    try {
      return new Date(movie.release_date).getFullYear().toString();
    } catch {
      return 'N/A';
    }
  };

  const getRating = () => {
    return movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  };

  const getImageSource = () => {
    if (imageError || !movie.poster_path) {
      return { uri: 'https://via.placeholder.com/500x750/1C1C1C/FFFFFF?text=No+Image' };
    }
    return { uri: movieService.getImageUrl(movie.poster_path) };
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, getCardSize()]} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={getImageSource()}
        style={[styles.poster, getCardSize()]}
        resizeMode="cover"
        onError={handleImageError}
      />
      
      {/* Rating Badge */}
      {movie.vote_average && movie.vote_average > 0 && (
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color={COLORS.accent} />
          <Text style={styles.rating}>{getRating()}</Text>
        </View>
      )}

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['transparent', COLORS.overlayDark]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
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

      {/* Hover Effect */}
      <View style={styles.hoverOverlay} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginHorizontal: 4,
    backgroundColor: COLORS.card,
    ...SHADOWS.medium,
  },
  poster: {
    borderRadius: SIZES.radius,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.base,
    paddingTop: SIZES.padding,
  },
  title: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 2,
    textShadowColor: COLORS.overlayDark,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  year: {
    color: COLORS.textSecondary,
    fontSize: FONTS.body4.fontSize,
  },
  ratingContainer: {
    position: 'absolute',
    top: SIZES.base,
    right: SIZES.base,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.overlay,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    ...SHADOWS.light,
  },
  rating: {
    color: COLORS.text,
    fontSize: FONTS.body4.fontSize,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  hoverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primary,
    opacity: 0,
  },
});