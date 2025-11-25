// src/screens/movie/SearchScreen.tsx - CẬP NHẬT
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MovieCard from '../../components/movie/MovieCard';
import { COLORS, FONTS, SHADOWS, SIZES } from '../../constants';
import { RootStackParamList } from '../../navigation/AppNavigator';
import api from '../../services/api';

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
  const [activeCategory, setActiveCategory] = useState<'all' | 'movies' | 'actors'>('all');
  
  const searchInputRef = useRef<TextInput>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Tìm kiếm tự động
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      setSuggestionsLoading(true);
      setShowSuggestions(true);
      
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await api.searchMoviesAndActors(searchQuery);
          const movies = results.filter((item: any) => item.media_type === 'movie').slice(0, 5);
          setSearchSuggestions(movies);
        } catch (error) {
          console.error('Suggestions error:', error);
          setSearchSuggestions([]);
        } finally {
          setSuggestionsLoading(false);
        }
      }, 500) as unknown as NodeJS.Timeout;
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
      setSearchResults(results || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionPress = (movie: any) => {
    setSearchQuery(movie.title || movie.name);
    setShowSuggestions(false);
    navigation.navigate('MovieDetail', { movieId: movie.id });
  };

  const handleMoviePress = (movie: any) => {
    navigation.navigate('MovieDetail', { movieId: movie.id });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchSuggestions([]);
    setHasSearched(false);
    setShowSuggestions(false);
    setActiveCategory('all');
    searchInputRef.current?.focus();
  };

  const getFilteredResults = () => {
    if (activeCategory === 'movies') {
      return searchResults.filter(item => item.media_type === 'movie');
    } else if (activeCategory === 'actors') {
      return searchResults.filter(item => item.media_type === 'person');
    }
    return searchResults;
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

  const renderMovieItem = ({ item, index }: { item: any; index: number }) => (
    <MovieCard
      movie={item}
      onPress={handleMoviePress}
      size={index === 0 ? 'large' : 'medium'}
    />
  );

  const renderActorCard = (actor: any) => {
    const profileUrl = actor.profile_path 
      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
      : 'https://via.placeholder.com/200x300/333/666?text=No+Photo';
    
    return (
      <TouchableOpacity key={actor.id} style={styles.actorCard}>
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
      </TouchableOpacity>
    );
  };

  const categories = [
    { key: 'all', label: 'Tất cả', count: searchResults.length },
    { key: 'movies', label: 'Phim', count: searchResults.filter(item => item.media_type === 'movie').length },
    { key: 'actors', label: 'Diễn viên', count: searchResults.filter(item => item.media_type === 'person').length },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient colors={COLORS.gradientDark} style={styles.container}>
        
        {/* Search Header */}
        <View style={styles.searchHeader}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
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
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={20} color={COLORS.text} />
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
          {/* Category Filters */}
          {hasSearched && searchResults.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
              contentContainerStyle={styles.categoriesContent}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryButton,
                    activeCategory === category.key && styles.categoryButtonActive
                  ]}
                  onPress={() => setActiveCategory(category.key as any)}
                >
                  <Text style={[
                    styles.categoryText,
                    activeCategory === category.key && styles.categoryTextActive
                  ]}>
                    {category.label} ({category.count})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
            </View>
          )}

          {!loading && hasSearched && getFilteredResults().length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
              <Text style={styles.emptyText}>Thử với từ khóa khác hoặc kiểm tra chính tả</Text>
            </View>
          )}

          {!loading && getFilteredResults().length > 0 && (
            <View style={styles.resultsContainer}>
              {/* Movies Grid */}
              {(activeCategory === 'all' || activeCategory === 'movies') && 
               getFilteredResults().filter((item: any) => item.media_type === 'movie').length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Phim ({getFilteredResults().filter((item: any) => item.media_type === 'movie').length})
                  </Text>
                  <FlatList
                    data={getFilteredResults().filter((item: any) => item.media_type === 'movie')}
                    renderItem={renderMovieItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.moviesGrid}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              )}

              {/* Actors */}
              {(activeCategory === 'all' || activeCategory === 'actors') && 
               getFilteredResults().filter((item: any) => item.media_type === 'person').length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Diễn viên ({getFilteredResults().filter((item: any) => item.media_type === 'person').length})
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actorsScroll}>
                    {getFilteredResults()
                      .filter((item: any) => item.media_type === 'person')
                      .map(renderActorCard)}
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          {!hasSearched && !showSuggestions && (
            <View style={styles.placeholderContainer}>
              <Ionicons name="film-outline" size={80} color={COLORS.textMuted} style={styles.placeholderIcon} />
              <Text style={styles.placeholderTitle}>Tìm kiếm phim yêu thích</Text>
              <Text style={styles.placeholderText}>
                Nhập tên phim, diễn viên hoặc đạo diễn để bắt đầu tìm kiếm
              </Text>
              
              {/* Popular Searches */}
              <View style={styles.popularSearches}>
                <Text style={styles.popularSearchesTitle}>Tìm kiếm phổ biến:</Text>
                <View style={styles.popularTags}>
                  {['Avengers', 'Marvel', 'Disney', 'Action', 'Comedy'].map((tag) => (
                    <TouchableOpacity 
                      key={tag} 
                      style={styles.popularTag}
                      onPress={() => setSearchQuery(tag)}
                    >
                      <Text style={styles.popularTagText}>{tag}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 2,
    backgroundColor: COLORS.secondaryLight,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    marginRight: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
  },
  searchIcon: {
    marginRight: SIZES.base,
  },
  searchInput: {
    flex: 1,
    height: 50,
    ...FONTS.body1,
    color: COLORS.text,
    paddingVertical: 0,
  },
  clearButton: {
    padding: SIZES.base / 2,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  suggestionsContainer: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
    ...SHADOWS.medium,
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textMuted,
  },
  suggestionPoster: {
    width: 40,
    height: 60,
    borderRadius: 4,
    marginRight: SIZES.padding,
    backgroundColor: COLORS.textMuted,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionTitle: {
    ...FONTS.body2,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  suggestionDetails: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },
  suggestionsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  suggestionsLoadingText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base,
  },
  noSuggestions: {
    padding: SIZES.padding,
    alignItems: 'center',
  },
  noSuggestionsText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
  },
  categoriesScroll: {
    marginVertical: SIZES.padding,
  },
  categoriesContent: {
    paddingHorizontal: SIZES.padding,
  },
  categoryButton: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    ...FONTS.body3,
    color: COLORS.text,
  },
  categoryTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  loadingText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginTop: SIZES.base,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: SIZES.padding * 3,
  },
  emptyTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
  },
  emptyText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  resultsContainer: {
    padding: SIZES.padding,
  },
  section: {
    marginBottom: SIZES.padding * 2,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.padding,
    marginLeft: SIZES.base,
    fontWeight: 'bold',
  },
  moviesGrid: {
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  actorsScroll: {
    paddingLeft: SIZES.base,
  },
  actorCard: {
    alignItems: 'center',
    marginRight: SIZES.padding,
    width: 100,
  },
  actorPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.textMuted,
    marginBottom: SIZES.base,
    ...SHADOWS.medium,
  },
  actorInfo: {
    alignItems: 'center',
  },
  actorName: {
    ...FONTS.body3,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  actorKnownFor: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  placeholderContainer: {
    alignItems: 'center',
    padding: SIZES.padding * 3,
    marginTop: SIZES.padding * 2,
  },
  placeholderIcon: {
    marginBottom: SIZES.padding,
    opacity: 0.5,
  },
  placeholderTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SIZES.base,
    textAlign: 'center',
  },
  placeholderText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.padding * 2,
  },
  popularSearches: {
    alignItems: 'center',
  },
  popularSearchesTitle: {
    ...FONTS.body2,
    color: COLORS.text,
    marginBottom: SIZES.padding,
  },
  popularTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  popularTag: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: 20,
    margin: SIZES.base / 2,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
  },
  popularTagText: {
    ...FONTS.body3,
    color: COLORS.text,
  },
});