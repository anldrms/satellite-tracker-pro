# 🛰️ Professional Satellite Tracker

Real-time 3D visualization of 2500+ satellites orbiting Earth using CesiumJS and live TLE data from CelesTrak.

![Satellites](https://img.shields.io/badge/Satellites-2500+-blue)
![3D](https://img.shields.io/badge/3D-Cesium-green)
![API](https://img.shields.io/badge/API-CelesTrak-orange)

## 🌟 Features

### Real-Time Tracking
- **2500+ Active Satellites** from CelesTrak API (including 2000+ Starlink satellites)
- Live position updates using TLE (Two-Line Element) data
- Accurate orbital mechanics calculations
- Real-time velocity and altitude data

### 3D Visualization
- **CesiumJS 3D Globe** - Professional-grade Earth visualization
- High-resolution NASA imagery
- **Country Borders** - Beautiful cyan-colored borders showing all countries
- Atmospheric lighting effects
- Day/night cycles
- Smooth camera controls

### Satellite Categories
- 🔵 **Starlink** (2000+ satellites) - Global internet constellation
- 🔴 **Space Stations** - ISS, Tiangong, Hubble
- 🟢 **Weather** - NOAA, METOP, GOES, FengYun, Aqua, Terra
- 🟡 **GPS Operational** - All active GPS satellites
- 🟠 **GLONASS** - Russian navigation system
- 🟣 **Galileo** - European navigation system
- 🇹🇷 **Türksat** - Turkish communication and observation satellites
- 🔷 **Communications** - Geostationary satellites (includes Astra, Eutelsat, etc.)
- 🟩 **Earth Observation** - Resource monitoring satellites
- 💜 **Science** - Scientific research satellites

### Interactive Features
- **Search** - Find any satellite by name
- **Category Filtering** - Toggle categories on/off
- **Click to Select** - View detailed satellite information with representative images
- **Playback Speed Control** - 1x, 10x, 50x, 100x speed
- **Camera Controls** - Zoom (mouse wheel), pan, rotate the Earth
- **Fly to Satellite** - Automatic camera movement
- **Satellite Images** - Each satellite shows a representative image based on its category

## 🚀 Quick Start

### Live Demo
🌐 **[View Live Demo](https://anldrms.github.io/satellite-tracker-pro/)**

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local development)
- Internet connection (for CDN resources and API)

### Option 1: Deploy to GitHub Pages (Recommended)

1. **Fork this repository** or create a new repo
2. **Push the code** to your GitHub repository
3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `(root)`
   - Click Save
4. **Wait 1-2 minutes** for deployment
5. **Visit**: `https://your-username.github.io/repository-name/`

The included GitHub Actions workflow will automatically deploy on every push to `main`.

### Option 2: Local Development

1. Clone or download this repository
2. Navigate to the directory:
   ```bash
   cd satellite-tracker-pro
   ```

3. Start local server:
   ```bash
   python3 -m http.server 8000
   # or
   npx serve
   ```

4. Open in browser:
   ```
   http://localhost:8000
   ```

## 📖 Usage Guide

### Initial Loading
1. Wait for the loading screen - it fetches real satellite data from CelesTrak
2. Progress bar shows the loading status
3. All satellites will appear on the 3D globe

### Viewing Satellites
- **Colored dots** represent satellites
- **Different colors** for different categories
- **Click** any satellite to view details
- **Hover** to see highlight

### Controls
- **Left Click & Drag** - Rotate Earth
- **Right Click & Drag** - Pan camera
- **Scroll** - Zoom in/out
- **Home Button** - Reset to default view
- **Play/Pause** - Control time
- **Speed Button** - Change playback speed

### Filtering
- Use the **sidebar** to toggle categories
- Use **search box** to find specific satellites
- Click **category filters** to show/hide groups

### Information Panel
- Opens when you click a satellite
- Shows:
  - Representative satellite image based on category
  - Satellite name and category
  - Current latitude/longitude
  - Altitude (km)
  - Velocity (km/h)
  - Last update time

## 🛠️ Technical Details

### Technologies Used
- **CesiumJS 1.109** - 3D geospatial visualization
- **Satellite.js 5.0** - SGP4/SDP4 orbit propagation
- **CelesTrak API** - Real-time TLE data source
- **Vanilla JavaScript** - No framework dependencies
- **CSS3** - Modern styling with animations

### Data Sources
- **TLE Data**: [CelesTrak](https://celestrak.org/)
- **Earth Imagery**: Cesium Ion (NASA/ESA)
- **Satellite Categories**: NORAD classification

### Orbital Calculations
- Uses SGP4/SDP4 propagation model
- Converts ECI (Earth-Centered Inertial) to geodetic coordinates
- Calculates position, velocity, and altitude
- Updates in real-time

## 📊 Performance

- Handles 2500+ satellites smoothly (including 2000+ Starlink)
- Efficient entity management
- Optimized render loop
- Lazy loading for satellite list
- GPU-accelerated 3D rendering

## 🎨 Customization

### Adding More Satellites
Edit `app.js` and modify the `tleGroups` array:

```javascript
{ 
    name: 'Category Name',
    url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=group&FORMAT=tle',
    color: '#hexcolor',
    limit: 100 // optional
}
```

### Changing Colors
Modify CSS variables in `style.css`:

```css
:root {
    --primary: #00d9ff;
    --secondary: #0066ff;
    --accent: #ff00ff;
}
```

### API Keys
The app uses a free Cesium Ion token. For production:
1. Sign up at [Cesium Ion](https://cesium.com/ion/)
2. Get your free API key
3. Replace token in `app.js`

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Mobile Support

- Fully responsive design
- Touch-optimized controls
- Collapsible sidebar
- Works on tablets and phones

## 🔒 Privacy & Security

- No user data collection
- No tracking or analytics
- Runs entirely client-side
- Only connects to CelesTrak API for satellite data

## 🚧 Known Limitations

- Initial load time depends on internet speed
- Some satellites may have outdated TLE data
- Very old satellites might not propagate correctly
- Performance varies with device capabilities

## 🔮 Future Enhancements

Potential improvements:
- [ ] Orbital path visualization
- [ ] Ground track display
- [ ] Pass predictions for user location
- [ ] Historical satellite positions
- [ ] Satellite collision warnings
- [ ] Export tracking data
- [ ] Multiple view modes (2D/3D)
- [ ] Custom satellite groups
- [ ] Notification system
- [ ] Dark/light theme toggle

## 📝 License

This project is open source and available for personal and educational use.

### Credits
- Satellite data: [CelesTrak](https://celestrak.org/)
- 3D Engine: [CesiumJS](https://cesium.com/)
- Orbital calculations: [Satellite.js](https://github.com/shashwatak/satellite-js)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 💬 Support

For questions or issues:
1. Check the browser console for errors
2. Ensure you have internet connection
3. Try refreshing the page
4. Clear browser cache

## 🌟 Acknowledgments

Special thanks to:
- CelesTrak for providing free TLE data
- Cesium team for the amazing 3D engine
- Space-Track.org for satellite information
- NASA for Earth imagery

---

**Made with ❤️ for space enthusiasts**

*Track satellites in real-time and explore Earth from space!*
