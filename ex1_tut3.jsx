import React, { useState } from 'react';
import {StyleSheet,Text,View,TextInput,TouchableOpacity,ImageBackground,ActivityIndicator,Alert,Keyboard,TouchableWithoutFeedback,} from 'react-native';

const WeatherApp = () => {
  const [inputCity, setInputCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(
    'https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=1000&auto=format&fit=crop' // Hình mặc định
  );

  // Hàm xử lý gọi API
  const fetchWeather = async () => {
    if (inputCity.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập tên thành phố!');
      return;
    }

    setLoading(true);
    setWeatherData(null); // Reset dữ liệu cũ
    Keyboard.dismiss(); // Ẩn bàn phím

    try {
      // BƯỚC 1: Lấy tọa độ (Latitude/Longitude) từ Geocoding API [cite: 10]
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${inputCity}&count=1&language=en&format=json`;
      const geoResponse = await fetch(geoUrl);
      const geoResult = await geoResponse.json();

      if (!geoResult.results || geoResult.results.length === 0) {
        throw new Error('City not found'); // Xử lý lỗi không tìm thấy [cite: 21]
      }

      const { latitude, longitude, name, country } = geoResult.results[0];

      // BƯỚC 2: Lấy dữ liệu thời tiết từ Open-Meteo API 
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherResult = await weatherResponse.json();

      const current = weatherResult.current_weather;

      // Cập nhật State để hiển thị UI
      setWeatherData({
        city: name,
        country: country,
        temperature: current.temperature, // Hiển thị độ C 
        weatherCode: current.weathercode,
      });

      // Cập nhật hình nền dựa trên WMO Code [cite: 18]
      updateBackground(current.weathercode);

    } catch (error) {
      // Hiển thị thông báo lỗi khi không tìm thấy thành phố hoặc lỗi mạng
      Alert.alert('Lỗi', 'Không tìm thấy thành phố hoặc lỗi mạng.');
      
      // Reset hình nền về mặc định nếu lỗi
      setBackgroundImage('https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=1000&auto=format&fit=crop');
    } finally {
      setLoading(false); // Tắt icon loading
    }
  };

  // Hàm map WMO Weather Codes sang hình ảnh URL [cite: 18]
  const updateBackground = (code) => {
    // Code tham khảo từ: https://open-meteo.com/en/docs
    // 0: Clear sky
    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    // 45, 48: Fog
    // 51-67: Drizzle & Rain
    // 71-77: Snow
    // 95-99: Thunderstorm

    let imageUrl = '';

    if (code === 0) {
      imageUrl = 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1000&auto=format&fit=crop'; // Nắng
    } else if (code >= 1 && code <= 3) {
      imageUrl = 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1000&auto=format&fit=crop'; // Mây
    } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      imageUrl = 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1000&auto=format&fit=crop'; // Mưa
    } else if (code >= 71 && code <= 77) {
      imageUrl = 'https://images.unsplash.com/photo-1516431883744-345f6165922d?q=80&w=1000&auto=format&fit=crop'; // Tuyết
    } else if (code >= 95) {
      imageUrl = 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=1000&auto=format&fit=crop'; // Bão
    } else {
      imageUrl = 'https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=1000&auto=format&fit=crop'; // Mặc định
    }

    setBackgroundImage(imageUrl);
  };

  return (

      <View style={styles.container}>
        {/* ImageBackground động  */}
        <ImageBackground source={{ uri: backgroundImage }} resizeMode="cover" style={styles.background}>
          
          {/* Lớp phủ đen mờ để chữ dễ đọc hơn */}
          <View style={styles.overlay}>
            
            {/* Phần nhập liệu [cite: 7, 8] */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter city name (e.g. Hanoi)"
                placeholderTextColor="#ccc"
                value={inputCity}
                onChangeText={setInputCity}
                onSubmitEditing={fetchWeather} 
              />
              <TouchableOpacity style={styles.button} onPress={fetchWeather}>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>

            {/* Loading Indicator [cite: 20] */}
            {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />}

            {/* Hiển thị thông tin thời tiết  */}
            {!loading && weatherData && (
              <View style={styles.infoContainer}>
                <Text style={styles.cityText}>
                  {weatherData.city}, {weatherData.country}
                </Text>
                <Text style={styles.tempText}>{weatherData.temperature}°C</Text>
                <Text style={styles.conditionText}>
                  WMO Code: {weatherData.weatherCode}
                </Text>
              </View>
            )}
            
          </View>
        </ImageBackground>
      </View>
 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Làm tối nền ảnh
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    marginRight: 10,
  },
  button: {
    backgroundColor: '#fff',
    height: 50,
    width: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  cityText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  tempText: {
    fontSize: 80,
    fontWeight: '200',
    color: '#fff',
  },
  conditionText: {
    fontSize: 20,
    color: '#eee',
    fontStyle: 'italic',
  },
});

export default WeatherApp;