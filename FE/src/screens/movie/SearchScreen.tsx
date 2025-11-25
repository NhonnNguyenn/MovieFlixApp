// src/screens/movie/SearchScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { COLORS } from '../../constants';
import { RootStackParamList } from '../../navigation/AppNavigator';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // SỬA: Khởi tạo useRef với null
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Tìm kiếm tự động sau khi ngừng gõ 500ms
  useEffect(() => {
    if (searchQuery.trim().length > 2) { // Chỉ tìm kiếm khi có ít nhất 3 ký tự
      setSuggestionsLoading(true);
      setShowSuggestions(true);
      
      // Clear timeout cũ
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      // Set timeout mới
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await api.searchMoviesAndActors(searchQuery);
          const movies = results.filter((item: { media_type: string }) => item.media_type === 'movie').slice(0, 5); // Giới hạn 5 phim
          setSearchSuggestions(movies);
        } catch (error) {
          console.error('Suggestions error:', error);
          setSearchSuggestions([]);
        } finally {
          setSuggestionsLoading(false);
        }
      }, 500) as unknown as NodeJS.Timeout; // 500ms delay
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      setSuggestionsLoading(false);
    }
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setHasSearched(false);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setShowSuggestions(false);
    try {
      const results = await api.searchMoviesAndActors(query);
      console.log('🔍 Search results:', results);
      setSearchResults(results || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionPress = (movie: any) => {
    console.log('🎬 Navigating to movie from suggestion:', movie.id);
    setSearchQuery(movie.title || movie.name);
    setShowSuggestions(false);
    navigation.navigate('MovieDetail', { movieId: movie.id });
  };

  const handleMoviePress = (movie: any) => {
    console.log('🎬 Navigating to movie from search:', movie.id);
    navigation.navigate('MovieDetail', { movieId: movie.id });
  };

  const renderSuggestionItem = ({ item }: { item: any }) => {
    const posterUrl = item.poster_path 
      ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
      : 'https://via.placeholder.com/92x138/333/666?text=No+Poster';
    
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
    const year = item.release_date ? new Date(item.release_date).getFullYear() : 'N/A';

    return (
      <TouchableOpacity 
        style={styles.suggestionItem}
        onPress={() => handleSuggestionPress(item)}
      >
        <Image
          source={{ uri: posterUrl }}
          style={styles.suggestionPoster}
          resizeMode="cover"
        />
        <View style={styles.suggestionInfo}>
          <Text style={styles.suggestionTitle} numberOfLines={1}>
            {item.title || item.name}
          </Text>
          <Text style={styles.suggestionDetails}>
            {year} • ⭐ {rating}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
      </TouchableOpacity>
    );
  };

  const renderMovieCard = (movie: any) => {
    const posterUrl = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : 'https://via.placeholder.com/200x300/333/666?text=No+Poster';
    
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

    return (
      <TouchableOpacity 
        key={movie.id} 
        style={styles.movieCard}
        onPress={() => handleMoviePress(movie)}
      >
        <Image
          source={{ uri: posterUrl }}
          style={styles.moviePoster}
          resizeMode="cover"
        />
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {movie.title || movie.name}
          </Text>
          <Text style={styles.movieRating}>
            ⭐ {rating}/10
          </Text>
          <Text style={styles.movieYear}>
            {year}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderActorCard = (actor: any) => {
    const profileUrl = actor.profile_path 
      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
      : 'https://via.placeholder.com/200x300/333/666?text=No+Photo';
    
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

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchSuggestions([]);
    setHasSearched(false);
    setShowSuggestions(false);
  };

  return (
    <LinearGradient colors={[COLORS.secondary, COLORS.background]} style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm phim, diễn viên..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Tìm</Text>
        </TouchableOpacity>
      </View>

      {/* Search Suggestions */}
      {showSuggestions && searchQuery.length > 2 && (
        <View style={styles.suggestionsContainer}>
          {suggestionsLoading ? (
            <View style={styles.suggestionsLoading}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.suggestionsLoadingText}>Đang tìm kiếm...</Text>
            </View>
          ) : searchSuggestions.length > 0 ? (
            <FlatList
              data={searchSuggestions}
              renderItem={renderSuggestionItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
            />
          ) : (
            <View style={styles.noSuggestions}>
              <Text style={styles.noSuggestionsText}>Không tìm thấy gợi ý</Text>
            </View>
          )}
        </View>
      )}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
          </View>
        )}

        {!loading && hasSearched && searchResults.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
            <Text style={styles.emptyText}>Thử với từ khóa khác</Text>
          </View>
        )}

        {!loading && searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            {/* Movies */}
            {searchResults.filter(item => item.media_type === 'movie').length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Phim ({searchResults.filter(item => item.media_type === 'movie').length})</Text>
                <View style={styles.moviesGrid}>
                  {searchResults
                    .filter(item => item.media_type === 'movie')
                    .map(renderMovieCard)}
                </View>
              </View>
            )}

            {/* Actors */}
            {searchResults.filter(item => item.media_type === 'person').length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Diễn viên ({searchResults.filter(item => item.media_type === 'person').length})</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actorsScroll}>
                  {searchResults
                    .filter(item => item.media_type === 'person')
                    .map(renderActorCard)}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {!hasSearched && !showSuggestions && (
          <View style={styles.placeholderContainer}>
            <Ionicons name="film-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.placeholderTitle}>Tìm kiếm phim yêu thích</Text>
            <Text style={styles.placeholderText}>
              Nhập tên phim, diễn viên hoặc đạo diễn để bắt đầu tìm kiếm
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: COLORS.text,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchButtonText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  // Styles cho search suggestions
  suggestionsContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
    borderRadius: 12,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  suggestionPoster: {
    width: 40,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: COLORS.textMuted,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  suggestionDetails: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  suggestionsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  suggestionsLoadingText: {
    marginLeft: 8,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  noSuggestions: {
    padding: 16,
    alignItems: 'center',
  },
  noSuggestionsText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  resultsContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    marginLeft: 8,
  },
  moviesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  movieCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
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
  movieRating: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  actorsScroll: {
    paddingLeft: 8,
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
    backgroundColor: COLORS.textMuted,
    marginBottom: 8,
  },
  actorInfo: {
    alignItems: 'center',
  },
  actorName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  actorKnownFor: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  placeholderContainer: {
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 14,
  },
});