// src/screens/MovieDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import api from '../../services/api';
import { MovieDetails } from '../../types/movie'; 

type Props = {
  route: RouteProp<{ params: { movieId: number } }, 'params'>;
};

export default function MovieDetailScreen({ route }: Props) {
  const { movieId } = route.params;
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovieDetails();
  }, [movieId]);

  const loadMovieDetails = async () => {
    setLoading(true);
    const details = await api.getMovieDetails(movieId);
    setMovieDetails(details);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  if (!movieDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Không tìm thấy thông tin phim</Text>
      </View>
    );
  }

  const { movie, credits } = movieDetails;
  const mainCast = credits.cast.slice(0, 10);

  return (
    <ScrollView style={styles.container}>
      {/* Movie Poster and Basic Info */}
      <View style={styles.header}>
        <Image
          source={{ uri: movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : 'https://via.placeholder.com/500x300' }}
          style={styles.backdrop}
        />
        <View style={styles.posterContainer}>
          <Image
            source={{ uri: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450' }}
            style={styles.poster}
          />
        </View>
      </View>

      {/* Movie Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.rating}>⭐ {movie.vote_average?.toFixed(1)}/10 ({movie.vote_count} lượt đánh giá)</Text>
        <Text style={styles.releaseDate}>📅 {new Date(movie.release_date).toLocaleDateString('vi-VN')}</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
      </View>

      {/* Cast */}
      <View style={styles.castSection}>
        <Text style={styles.sectionTitle}>Diễn viên</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mainCast.map(actor => (
            <View key={actor.id} style={styles.actorCard}>
              <Image
                source={{ uri: actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/100x150' }}
                style={styles.actorPhoto}
              />
              <Text style={styles.actorName} numberOfLines={2}>{actor.name}</Text>
              <Text style={styles.actorCharacter} numberOfLines={2}>{actor.character}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
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
  },
  header: {
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
    borderRadius: 8,
  },
  infoContainer: {
    marginTop: 60,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rating: {
    fontSize: 16,
    color: '#f39c12',
    marginBottom: 5,
  },
  releaseDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  castSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actorCard: {
    alignItems: 'center',
    marginRight: 15,
    width: 100,
  },
  actorPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  actorName: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actorCharacter: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});