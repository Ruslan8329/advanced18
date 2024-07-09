class MovieService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://www.omdbapi.com/";
  }

  async search(title, type = "", page = 1) {
    const url = `${this.baseUrl}?apikey=${this.apiKey}&s=${title}&type=${type}&page=${page}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      const data = await response.json();
      if (data.Response === "False") {
        throw new Error(data.Error);
      }
      return data;
    } catch (error) {
      console.error("Ошибка при поиске фильмов:", error);
      throw error;
    }
  }

  async getMovie(movieId) {
    const url = `${this.baseUrl}?apikey=${this.apiKey}&i=${movieId}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      const data = await response.json();
      if (data.Response === "False") {
        throw new Error(data.Error);
      }
      return data;
    } catch (error) {
      console.error("Ошибка при получении информации о фильме:", error);
      throw error;
    }
  }
}
