// Satellite Tracker Pro - Real-Time Global Coverage
class SatelliteTracker {
    constructor() {
        this.viewer = null;
        this.satellites = [];
        this.entities = new Map();
        this.categories = new Map();
        this.activeCategories = new Set();
        this.selectedSatellite = null;
        this.isPlaying = true;
        this.playbackSpeed = 1;
        this.speeds = [1, 10, 50, 100];
        this.speedIndex = 0;
        
        this.init();
    }

    async init() {
        this.updateLoadingStatus('Initializing 3D Earth...');
        await this.initCesium();
        
        this.updateLoadingStatus('Fetching satellite data from CelesTrak...');
        await this.loadSatelliteData();
        
        this.updateLoadingStatus('Creating satellite entities...');
        this.createSatelliteEntities();
        
        this.updateLoadingStatus('Setting up UI...');
        this.setupUI();
        this.setupEventListeners();
        
        this.updateLoadingStatus('Starting real-time tracking...');
        this.startAnimation();
        
        setTimeout(() => {
            document.getElementById('loadingScreen').classList.add('hidden');
        }, 500);
    }

    updateLoadingStatus(status) {
        document.getElementById('loadingStatus').textContent = status;
    }

    updateProgress(percent) {
        document.getElementById('progressBar').style.width = `${percent}%`;
    }

    async initCesium() {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5N2UyMjcwOS00MDY1LTQxYjEtYjZjMy00YTU0ZTg1YmJjMGIiLCJpZCI6ODAzMDYsImlhdCI6MTY0Mjc0ODI2MX0.OiWBnMZxmIRHs_f9uXlPvzpQOw4lWQXKcvCiSF8qBiY';
        
        this.viewer = new Cesium.Viewer('cesiumContainer', {
            imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            animation: false,
            timeline: false,
            fullscreenButton: false,
            vrButton: false,
            scene3DOnly: true,
            shouldAnimate: true
        });

        // Better visual settings
        this.viewer.scene.globe.enableLighting = true;
        this.viewer.scene.globe.atmosphereLightIntensity = 10.0;
        this.viewer.scene.skyAtmosphere.hueShift = -0.3;
        this.viewer.scene.skyAtmosphere.saturationShift = 0.3;
        this.viewer.scene.skyAtmosphere.brightnessShift = -0.2;
        
        // Set initial camera position
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(0, 30, 20000000)
        });
        
        this.updateProgress(10);
    }

    async loadSatelliteData() {
        // CelesTrak TLE data groups
        const tleGroups = [
            { name: 'Starlink', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle', color: '#00d9ff' }, // No limit - load all Starlink satellites (2000+)
            { name: 'Space Stations', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle', color: '#ff0044' },
            { name: 'Weather', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=weather&FORMAT=tle', color: '#00ff88' },
            { name: 'GPS Operational', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=tle', color: '#ffaa00' },
            { name: 'GLONASS', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=glonass-ops&FORMAT=tle', color: '#ff6600' },
            { name: 'Galileo', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=galileo&FORMAT=tle', color: '#aa00ff' },
            { name: 'Communications', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=geo&FORMAT=tle', color: '#00aaff', limit: 50 },
            { name: 'Earth Observation', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=resource&FORMAT=tle', color: '#88ff00', limit: 30 },
            { name: 'Science', url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=science&FORMAT=tle', color: '#ff00ff', limit: 30 }
        ];

        let loadedCount = 0;
        const totalGroups = tleGroups.length;

        for (const group of tleGroups) {
            try {
                const satellites = await this.fetchTLEGroup(group);
                
                this.categories.set(group.name, {
                    name: group.name,
                    color: group.color,
                    satellites: satellites,
                    count: satellites.length
                });
                
                this.activeCategories.add(group.name);
                this.satellites.push(...satellites);
                
                loadedCount++;
                this.updateProgress(10 + (loadedCount / totalGroups) * 60);
                
                console.log(`Loaded ${satellites.length} satellites from ${group.name}`);
            } catch (error) {
                console.error(`Failed to load ${group.name}:`, error);
            }
        }

        this.updateProgress(70);
        console.log(`Total satellites loaded: ${this.satellites.length}`);
    }

    async fetchTLEGroup(group) {
        try {
            const response = await fetch(group.url);
            const text = await response.text();
            return this.parseTLE(text, group.name, group.color, group.limit);
        } catch (error) {
            console.error(`Error fetching ${group.name}:`, error);
            return [];
        }
    }

    parseTLE(tleData, category, color, limit = null) {
        const lines = tleData.trim().split('\n');
        const satellites = [];
        
        for (let i = 0; i < lines.length; i += 3) {
            if (i + 2 >= lines.length) break;
            if (limit && satellites.length >= limit) break;
            
            const name = lines[i].trim();
            const tle1 = lines[i + 1].trim();
            const tle2 = lines[i + 2].trim();
            
            if (name && tle1 && tle2) {
                try {
                    const satrec = satellite.twoline2satrec(tle1, tle2);
                    satellites.push({
                        name,
                        tle1,
                        tle2,
                        satrec,
                        category,
                        color
                    });
                } catch (error) {
                    console.error(`Error parsing satellite ${name}:`, error);
                }
            }
        }
        
        return satellites;
    }

    createSatelliteEntities() {
        let created = 0;
        const total = this.satellites.length;
        
        this.satellites.forEach((sat, index) => {
            const entity = this.viewer.entities.add({
                position: new Cesium.CallbackProperty(() => {
                    return this.getSatellitePosition(sat);
                }, false),
                point: {
                    pixelSize: 6,
                    color: Cesium.Color.fromCssColorString(sat.color),
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 1,
                    heightReference: Cesium.HeightReference.NONE
                },
                label: {
                    text: '',
                    font: '12px Space Grotesk',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    pixelOffset: new Cesium.Cartesian2(0, -15),
                    showBackground: false,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 8000000)
                },
                satelliteData: sat
            });
            
            this.entities.set(sat.name, entity);
            
            created++;
            if (created % 100 === 0) {
                this.updateProgress(70 + (created / total) * 20);
            }
        });
        
        this.updateProgress(90);
    }

    getSatellitePosition(sat) {
        try {
            const now = new Date();
            const positionAndVelocity = satellite.propagate(sat.satrec, now);
            
            if (positionAndVelocity.position && typeof positionAndVelocity.position !== 'boolean') {
                const positionEci = positionAndVelocity.position;
                const gmst = satellite.gstime(now);
                const positionGd = satellite.eciToGeodetic(positionEci, gmst);
                
                const longitude = satellite.degreesLong(positionGd.longitude);
                const latitude = satellite.degreesLat(positionGd.latitude);
                const height = positionGd.height * 1000; // Convert to meters
                
                return Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
            }
        } catch (error) {
            // Silent fail for bad propagation
        }
        
        return Cesium.Cartesian3.fromDegrees(0, 0, 0);
    }

    getSatelliteDetails(sat) {
        try {
            const now = new Date();
            const positionAndVelocity = satellite.propagate(sat.satrec, now);
            
            if (positionAndVelocity.position && typeof positionAndVelocity.position !== 'boolean') {
                const positionEci = positionAndVelocity.position;
                const gmst = satellite.gstime(now);
                const positionGd = satellite.eciToGeodetic(positionEci, gmst);
                
                const longitude = satellite.degreesLong(positionGd.longitude);
                const latitude = satellite.degreesLat(positionGd.latitude);
                const altitude = positionGd.height;
                
                let velocity = 0;
                if (positionAndVelocity.velocity && typeof positionAndVelocity.velocity !== 'boolean') {
                    const vel = positionAndVelocity.velocity;
                    velocity = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);
                }
                
                return {
                    longitude: longitude.toFixed(4),
                    latitude: latitude.toFixed(4),
                    altitude: altitude.toFixed(2),
                    velocity: (velocity * 3600).toFixed(2)
                };
            }
        } catch (error) {
            console.error('Error getting satellite details:', error);
        }
        
        return null;
    }

    setupUI() {
        // Update stats
        document.getElementById('totalSats').textContent = this.satellites.length.toLocaleString();
        document.getElementById('activeSats').textContent = this.satellites.length.toLocaleString();
        document.getElementById('categoriesCount').textContent = this.categories.size;
        
        // Create category filters
        const filtersContainer = document.getElementById('categoryFilters');
        this.categories.forEach((category, name) => {
            const filterDiv = document.createElement('div');
            filterDiv.className = 'category-filter active';
            filterDiv.dataset.category = name;
            filterDiv.innerHTML = `
                <div class="category-checkbox"></div>
                <div class="category-info">
                    <div class="category-name">${name}</div>
                    <div class="category-count">${category.count} satellites</div>
                </div>
                <div class="category-color" style="background: ${category.color};"></div>
            `;
            filterDiv.addEventListener('click', () => this.toggleCategory(name));
            filtersContainer.appendChild(filterDiv);
        });
        
        // Create legend
        const legendContainer = document.getElementById('legendItems');
        this.categories.forEach((category) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-color" style="background: ${category.color};"></div>
                <div class="legend-label">${category.name}</div>
            `;
            legendContainer.appendChild(legendItem);
        });
        
        // Update satellite list
        this.updateSatelliteList();
        
        this.updateProgress(95);
    }

    updateSatelliteList() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const listContainer = document.getElementById('satelliteList');
        
        const filtered = this.satellites.filter(sat => {
            const matchesSearch = sat.name.toLowerCase().includes(searchTerm);
            const matchesCategory = this.activeCategories.has(sat.category);
            return matchesSearch && matchesCategory;
        });
        
        document.getElementById('visibleCount').textContent = filtered.length.toLocaleString();
        
        if (filtered.length === 0) {
            listContainer.innerHTML = '<div class="loading-satellites">No satellites found</div>';
            return;
        }
        
        // Only show first 100 in list for performance
        const toShow = filtered.slice(0, 100);
        
        listContainer.innerHTML = toShow.map(sat => {
            const details = this.getSatelliteDetails(sat);
            return `
                <div class="satellite-item" data-name="${sat.name}">
                    <div class="satellite-header">
                        <div class="satellite-indicator" style="background: ${sat.color};"></div>
                        <div class="satellite-name">${sat.name}</div>
                    </div>
                    <div class="satellite-details">
                        <span>Alt: ${details ? details.altitude : '—'} km</span>
                        <span>Vel: ${details ? details.velocity : '—'} km/h</span>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click listeners
        listContainer.querySelectorAll('.satellite-item').forEach(item => {
            item.addEventListener('click', () => {
                const satName = item.dataset.name;
                const sat = this.satellites.find(s => s.name === satName);
                if (sat) this.selectSatellite(sat);
            });
        });
        
        // Show message if there are more
        if (filtered.length > 100) {
            const moreDiv = document.createElement('div');
            moreDiv.className = 'loading-satellites';
            moreDiv.textContent = `Showing 100 of ${filtered.length} satellites. Use search to find specific satellites.`;
            listContainer.appendChild(moreDiv);
        }
    }

    toggleCategory(categoryName) {
        const filterDiv = document.querySelector(`.category-filter[data-category="${categoryName}"]`);
        
        if (this.activeCategories.has(categoryName)) {
            this.activeCategories.delete(categoryName);
            filterDiv.classList.remove('active');
            
            // Hide satellites in this category
            const category = this.categories.get(categoryName);
            category.satellites.forEach(sat => {
                const entity = this.entities.get(sat.name);
                if (entity) entity.show = false;
            });
        } else {
            this.activeCategories.add(categoryName);
            filterDiv.classList.add('active');
            
            // Show satellites in this category
            const category = this.categories.get(categoryName);
            category.satellites.forEach(sat => {
                const entity = this.entities.get(sat.name);
                if (entity) entity.show = true;
            });
        }
        
        this.updateSatelliteList();
        this.updateActiveSatsCount();
    }

    updateActiveSatsCount() {
        let count = 0;
        this.activeCategories.forEach(catName => {
            const category = this.categories.get(catName);
            count += category.count;
        });
        document.getElementById('activeSats').textContent = count.toLocaleString();
    }

    selectSatellite(sat) {
        this.selectedSatellite = sat;
        
        // Update list selection
        document.querySelectorAll('.satellite-item').forEach(item => {
            item.classList.toggle('selected', item.dataset.name === sat.name);
        });
        
        // Show info panel
        const panel = document.getElementById('infoPanel');
        const nameEl = document.getElementById('satName');
        const bodyEl = document.getElementById('infoBody');
        
        nameEl.textContent = sat.name;
        
        const details = this.getSatelliteDetails(sat);
        if (details) {
            bodyEl.innerHTML = `
                <div class="info-row">
                    <span class="info-label">Category</span>
                    <span class="info-value">${sat.category}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Latitude</span>
                    <span class="info-value">${details.latitude}°</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Longitude</span>
                    <span class="info-value">${details.longitude}°</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Altitude</span>
                    <span class="info-value">${details.altitude} km</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Velocity</span>
                    <span class="info-value">${details.velocity} km/h</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Last Updated</span>
                    <span class="info-value">${new Date().toLocaleTimeString()}</span>
                </div>
            `;
        }
        
        panel.classList.add('active');
        
        // Highlight satellite
        const entity = this.entities.get(sat.name);
        if (entity) {
            entity.point.pixelSize = 12;
            entity.label.text = sat.name;
            
            // Fly to satellite
            const position = this.getSatellitePosition(sat);
            if (position) {
                this.viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(
                        Cesium.Cartographic.fromCartesian(position).longitude * 180 / Math.PI,
                        Cesium.Cartographic.fromCartesian(position).latitude * 180 / Math.PI,
                        5000000
                    ),
                    duration: 2
                });
            }
        }
    }

    setupEventListeners() {
        // Search
        document.getElementById('searchInput').addEventListener('input', () => {
            this.updateSatelliteList();
        });
        
        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('collapsed');
        });
        
        // Close info panel
        document.getElementById('closeInfo').addEventListener('click', () => {
            document.getElementById('infoPanel').classList.remove('active');
            if (this.selectedSatellite) {
                const entity = this.entities.get(this.selectedSatellite.name);
                if (entity) {
                    entity.point.pixelSize = 6;
                    entity.label.text = '';
                }
            }
            this.selectedSatellite = null;
            document.querySelectorAll('.satellite-item').forEach(item => {
                item.classList.remove('selected');
            });
        });
        
        // Home button
        document.getElementById('homeBtn').addEventListener('click', () => {
            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(0, 30, 20000000),
                duration: 2
            });
        });
        
        // Play/Pause
        document.getElementById('playPauseBtn').addEventListener('click', () => {
            this.isPlaying = !this.isPlaying;
            this.viewer.clock.shouldAnimate = this.isPlaying;
            
            document.getElementById('playIcon').style.display = this.isPlaying ? 'none' : 'block';
            document.getElementById('pauseIcon').style.display = this.isPlaying ? 'block' : 'none';
        });
        
        // Speed control
        document.getElementById('speedBtn').addEventListener('click', () => {
            this.speedIndex = (this.speedIndex + 1) % this.speeds.length;
            this.playbackSpeed = this.speeds[this.speedIndex];
            this.viewer.clock.multiplier = this.playbackSpeed;
            document.getElementById('speedText').textContent = `${this.playbackSpeed}x`;
        });
        
        // Click handler for entities
        this.viewer.screenSpaceEventHandler.setInputAction((click) => {
            const pickedObject = this.viewer.scene.pick(click.position);
            if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.satelliteData) {
                this.selectSatellite(pickedObject.id.satelliteData);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        
        this.updateProgress(100);
    }

    startAnimation() {
        // Update selected satellite info periodically
        setInterval(() => {
            if (this.selectedSatellite) {
                this.selectSatellite(this.selectedSatellite);
            }
        }, 2000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new SatelliteTracker();
});
