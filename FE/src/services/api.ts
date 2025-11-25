// src/services/api.ts
const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjQwMDhmZjgwNmU5NDdmN2E4ZTg3YTNkYTYzMzIxYyIsIm5iZiI6MTc2MTk5MTg4OC42Mywic3ViIjoiNjkwNWRjZDA0Yzk4YzdlMTU0NTk3YjUzIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.7eHGjcVjlfqOGef18k0pFLWinD8nRTcIaHkQqZ5tiAY';

const API_BASE_URL = 'https://api.themoviedb.org/3';

// Hàm fetch với timeout
const fetchWithTimeout = async (url: string, options: any = {}, timeout = 15000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

const api = {
  async getPopularMovies() {
    try {
      const data = await fetchWithTimeout(
        `${API_BASE_URL}/movie/popular?language=vi-VN&page=1`,
        {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
          },
        }
      );
      return data.results || [];
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  },

  async getNowPlayingMovies() {
    try {
      const data = await fetchWithTimeout(
        `${API_BASE_URL}/movie/now_playing?language=vi-VN&page=1`,
        {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
          },
        }
      );
      return data.results || [];
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      return [];
    }
  },

  async getTopRatedMovies() {
    try {
      const data = await fetchWithTimeout(
        `${API_BASE_URL}/movie/top_rated?language=vi-VN&page=1`,
        {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
          },
        }
      );
      return data.results || [];
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      return [];
    }
  },

  async getUpcomingMovies() {
    try {
      const data = await fetchWithTimeout(
        `${API_BASE_URL}/movie/upcoming?language=vi-VN&page=1`,
        {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
          },
        }
      );
      return data.results || [];
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      return [];
    }
  },

  async getMovieVideos(movieId: number) {
    try {
      const data = await fetchWithTimeout(
        `${API_BASE_URL}/movie/${movieId}/videos?language=vi-VN`,
        {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
          },
        }
      );
      return data.results || [];
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      return [];
    }
  },

  async getMovieDetails(movieId: number) {
    try {
      console.log('🔄 Fetching details for movie:', movieId);
      
      const [movieResponse, creditsResponse, videosResponse] = await Promise.all([
        fetchWithTimeout(`${API_BASE_URL}/movie/${movieId}?language=vi-VN`, {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
          },
        }),
        fetchWithTimeout(`${API_BASE_URL}/movie/${movieId}/credits?language=vi-VN`, {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
          },
        }),
        fetchWithTimeout(`${API_BASE_URL}/movie/${movieId}/videos?language=vi-VN`, {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
          },
        })
      ]);

      console.log('✅ Movie details fetched:', { 
        title: movieResponse.title, 
        castCount: creditsResponse.cast?.length || 0,
        videoCount: videosResponse.results?.length || 0 
      });

      return {
        movie: movieResponse,
        credits: creditsResponse,
        videos: videosResponse.results || []
      };
    } catch (error) {
      console.error('❌ Error fetching movie details:', error);
      return null;
    }
  },

  async searchMoviesAndActors(query: string) {
    try {
      const data = await fetchWithTimeout(
        `${API_BASE_URL}/search/multi?query=${encodeURIComponent(query)}&language=vi-VN&page=1&include_adult=false`,
        {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
          },
        }
      );
      return data.results || [];
    } catch (error) {
      console.error('Error searching:', error);
      return [];
    }
  },
};

export default api;