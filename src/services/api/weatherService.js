class WeatherService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'weather_c';
  }

  async getCurrentWeather() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "temperature_c" } },
          { field: { Name: "condition_c" } },
          { field: { Name: "precipitation_c" } },
          { field: { Name: "wind_c" } },
          { field: { Name: "humidity_c" } },
          { field: { Name: "uv_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 5,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(weather => ({
        Id: weather.Id,
        date: weather.date_c || new Date().toLocaleDateString(),
        temperature: weather.temperature_c || 72,
        condition: weather.condition_c || 'Sunny',
        precipitation: weather.precipitation_c || 0,
        wind: weather.wind_c || 5,
        humidity: weather.humidity_c || 65,
        uv: weather.uv_c || 6,
        tags: weather.Tags || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching current weather:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getExtendedForecast() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "temperature_c" } },
          { field: { Name: "condition_c" } },
          { field: { Name: "precipitation_c" } },
          { field: { Name: "wind_c" } },
          { field: { Name: "humidity_c" } },
          { field: { Name: "uv_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          {
            fieldName: "date_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 14,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(weather => ({
        Id: weather.Id,
        date: weather.date_c || new Date().toLocaleDateString(),
        temperature: weather.temperature_c || 72,
        condition: weather.condition_c || 'Sunny',
        precipitation: weather.precipitation_c || 0,
        wind: weather.wind_c || 5,
        humidity: weather.humidity_c || 65,
        uv: weather.uv_c || 6,
        tags: weather.Tags || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching extended forecast:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }
}
export default new WeatherService();