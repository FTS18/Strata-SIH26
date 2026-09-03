'use client';

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { APP_CONFIG } from '@/config/constants';
import { useTelemetryStore } from '@/features/fleet-telemetry/telemetryStore';
import chandigarhOsmRoads from '@/config/chandigarhOsmRoads.json';

export interface MapViewportProps {
  onDefectClick?: (defectId: string) => void;
  onIncidentClick?: (incidentId: string) => void;
  onBusClick?: (busId: string) => void;
}

export function MapViewport({
  onDefectClick,
  onIncidentClick,
  onBusClick,
}: MapViewportProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const busMarkersRef = useRef<Record<string, maplibregl.Marker>>({});
  const defectMarkersRef = useRef<Record<string, maplibregl.Marker>>({});

  const buses = useTelemetryStore((state) => state.buses);
  const defects = useTelemetryStore((state) => state.defects);
  const selectedDefectId = useTelemetryStore((state) => state.selectedDefectId);

  // Initialize ArcGIS World Dark Gray Base Map with LOD-Filtered Road Layers
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'esri-dark-gray': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 16,
          },
          'esri-reference': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 16,
          },
        },
        layers: [
          {
            id: 'base-layer',
            type: 'raster',
            source: 'esri-dark-gray',
            minzoom: 0,
            maxzoom: 16,
          },
          {
            id: 'reference-layer',
            type: 'raster',
            source: 'esri-reference',
            minzoom: 0,
            maxzoom: 16,
            paint: {
              'raster-opacity': 0.65,
            },
          },
        ],
      },
      center: [APP_CONFIG.DEFAULT_CENTER.lng, APP_CONFIG.DEFAULT_CENTER.lat],
      zoom: APP_CONFIG.DEFAULT_ZOOM,
      minZoom: APP_CONFIG.MIN_ZOOM,
      maxZoom: 16,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      map.addSource('chandigarh-osm-roads', {
        type: 'geojson',
        data: chandigarhOsmRoads as any,
      });

      // 1. Road Outer Glow Layer (Vibrant Visibility across All Roads)
      map.addLayer({
        id: 'road-pci-glow',
        type: 'line',
        source: 'chandigarh-osm-roads',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 2.2,
            13, 4.5,
            16, 8.0,
          ],
          'line-opacity': 0.3,
          'line-blur': 1.5,
        },
      });

      // 2. Road Core Pavement Quality (PCI) Layer
      map.addLayer({
        id: 'road-pci-core',
        type: 'line',
        source: 'chandigarh-osm-roads',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 1.2,
            13, 2.2,
            16, 3.8,
          ],
          'line-opacity': 0.88,
        },
      });

      // Interactive Popup for Road Quality Inspection
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'custom-road-popup',
      });

      map.on('mouseenter', 'road-pci-core', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        if (e.features && e.features[0]) {
          const props = e.features[0].properties;
          popup
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="background: #092328; border: 1px solid #12544F; padding: 6px 10px; border-radius: 6px; font-family: monospace; font-size: 11px; color: #f0fdf4; box-shadow: 0 4px 12px rgba(0,0,0,0.8);">
                <div style="font-weight: 700; color: #f0fdf4; margin-bottom: 2px;">${props.roadName}</div>
                <div style="display: flex; gap: 8px; font-size: 10px; color: #8BBB92;">
                  <span>PCI Index: <strong style="color: ${props.color};">${props.pciScore}/100</strong></span>
                  <span>•</span>
                  <span style="color: ${props.color};">${props.status}</span>
                </div>
              </div>
            `)
            .addTo(map);
        }
      });

      map.on('mouseleave', 'road-pci-core', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sleek Compact 3D Bus Fleet Markers (Stable, Zero-Jump Anchor)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(buses).forEach((bus) => {
      const el = busMarkersRef.current[bus.id];
      const shortId = bus.busNumber.split('-').pop() || bus.busNumber;

      if (!el) {
        const markerEl = document.createElement('div');
        markerEl.className = 'cursor-pointer select-none';
        markerEl.style.pointerEvents = 'auto';
        markerEl.innerHTML = `
          <div class="strata-marker-inner" style="position: relative; display: flex; flex-direction: column; align-items: center; transition: transform 0.2s ease;">
            <!-- Floating Micro Telemetry Tag -->
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              background: rgba(9, 35, 40, 0.95);
              border: 1px solid #10B981;
              color: #f0fdf4;
              padding: 1px 6px;
              border-radius: 9999px;
              font-family: var(--font-mono, monospace);
              font-size: 9px;
              font-weight: 700;
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0,0,0,0.8);
              margin-bottom: 2px;
            ">
              <span style="display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #10B981; box-shadow: 0 0 6px #10B981;"></span>
              <span>${shortId}</span>
              <span class="bus-speed-label" style="color: #6ee7b7; font-size: 8px;">${bus.speedKmH}km/h</span>
            </div>

            <!-- Rotating Compact 3D Vehicle with Soft Radar Arc -->
            <div class="strata-3d-bus-wrapper" style="
              position: relative;
              width: 20px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              transform: rotate(${bus.headingDeg}deg);
              transition: transform 0.4s ease-out;
            ">
              <!-- Soft Forward Radar Arc -->
              <div style="
                position: absolute;
                top: -14px;
                left: 50%;
                transform: translateX(-50%);
                width: 24px;
                height: 16px;
                border-radius: 24px 24px 0 0;
                background: radial-gradient(circle at 50% 100%, rgba(16, 185, 129, 0.45) 0%, rgba(6, 182, 212, 0.1) 70%, transparent 100%);
                pointer-events: none;
              "></div>

              <!-- Compact 3D Top-Down CTU Smart Bus SVG -->
              <svg width="15" height="26" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="
                filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.85));
              ">
                <!-- Asphalt Shadow -->
                <rect x="1" y="2" width="14" height="24" rx="3.5" fill="rgba(0,0,0,0.5)"/>
                
                <!-- Main Chassis -->
                <rect x="1" y="1" width="14" height="25" rx="3.5" fill="url(#busGrad_${bus.id})" stroke="#047857" stroke-width="0.8"/>
                
                <!-- Front Windshield & Sky Reflection -->
                <path d="M2.5 5C2.5 3.5 3.8 2.2 5.5 2.2H10.5C12.2 2.2 13.5 3.5 13.5 5V7.5H2.5V5Z" fill="#0F172A"/>
                <path d="M3.8 3.8H12.2C12.2 3.8 11.5 6 10.8 6.5H5.2C4.5 6 3.8 3.8 3.8 3.8Z" fill="rgba(56, 189, 248, 0.5)"/>
                
                <!-- Dual LED Headlights -->
                <circle cx="3" cy="1.8" r="1" fill="#38BDF8"/>
                <circle cx="13" cy="1.8" r="1" fill="#38BDF8"/>
                
                <!-- Roof HVAC / Battery Pod -->
                <rect x="4" y="9.5" width="8" height="9.5" rx="2" fill="#022C22" stroke="#10B981" stroke-width="0.6"/>
                <line x1="5.5" y1="12" x2="10.5" y2="12" stroke="#10B981" stroke-width="0.6" stroke-linecap="round"/>
                <line x1="5.5" y1="14.5" x2="10.5" y2="14.5" stroke="#10B981" stroke-width="0.6" stroke-linecap="round"/>
                <line x1="5.5" y1="17" x2="10.5" y2="17" stroke="#10B981" stroke-width="0.6" stroke-linecap="round"/>
                
                <!-- Rear Window & Taillights -->
                <rect x="3.5" y="22" width="9" height="2" rx="1" fill="#0F172A"/>
                <rect x="2" y="24" width="2" height="1.2" rx="0.4" fill="#EF4444"/>
                <rect x="12" y="24" width="2" height="1.2" rx="0.4" fill="#EF4444"/>

                <!-- Body Metallic Gradients -->
                <defs>
                  <linearGradient id="busGrad_${bus.id}" x1="1" y1="1" x2="15" y2="26" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#34D399"/>
                    <stop offset="0.4" stop-color="#10B981"/>
                    <stop offset="1" stop-color="#047857"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        `;
        markerEl.onclick = () => onBusClick?.(bus.id);

        const marker = new maplibregl.Marker({ element: markerEl, anchor: 'center' })
          .setLngLat([bus.coords.lng, bus.coords.lat])
          .addTo(map);

        busMarkersRef.current[bus.id] = marker;
      } else {
        el.setLngLat([bus.coords.lng, bus.coords.lat]);
        
        // Update 3D gyroscopic rotation
        const busWrapper = el.getElement().querySelector('.strata-3d-bus-wrapper') as HTMLElement | null;
        if (busWrapper) {
          busWrapper.style.transform = `rotate(${bus.headingDeg}deg)`;
        }

        // Update speed label
        const speedLabel = el.getElement().querySelector('.bus-speed-label');
        if (speedLabel) {
          speedLabel.textContent = `${bus.speedKmH}km/h`;
        }
      }
    });
  }, [buses, onBusClick]);

  // Defect Markers (Clean, Static Anchor)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    defects.forEach((defect) => {
      if (!defectMarkersRef.current[defect.id]) {
        const markerEl = document.createElement('div');
        markerEl.className = 'cursor-pointer select-none';
        const isCritical = defect.severity === 'critical';
        const bg = isCritical ? '#ef4444' : '#f59e0b';
        
        markerEl.innerHTML = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            background: ${bg};
            color: #ffffff;
            border: 2px solid #092328;
            border-radius: 50%;
            font-size: 10px;
            font-weight: 800;
            box-shadow: 0 2px 6px rgba(0,0,0,0.8);
            transition: transform 0.15s ease;
          ">
            !
          </div>
        `;
        markerEl.onclick = () => onDefectClick?.(defect.id);

        const marker = new maplibregl.Marker({ element: markerEl, anchor: 'center' })
          .setLngLat([defect.coords.lng, defect.coords.lat])
          .addTo(map);

        defectMarkersRef.current[defect.id] = marker;
      }
    });
  }, [defects, onDefectClick]);

  // Pan gently to selected defect without jarring zoom jump
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedDefectId) return;

    const defect = defects.find((d) => d.id === selectedDefectId);
    if (defect) {
      map.easeTo({
        center: [defect.coords.lng, defect.coords.lat],
        duration: 500,
        essential: true,
      });
    }
  }, [selectedDefectId, defects]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#092328]">
      <div ref={mapContainerRef} className="h-full w-full" />
      
      {/* Pavement Quality Index (PCI) Live Network Legend */}
      <div className="absolute bottom-2.5 left-2.5 z-10 rounded-lg border border-[#12544F] bg-[#092328]/95 backdrop-blur-md px-3 py-2 font-mono text-[10px] text-[#8BBB92] shadow-xl pointer-events-none">
        <p className="font-bold text-[#f0fdf4] mb-1 uppercase tracking-wider">Pavement Condition Index (PCI)</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded bg-emerald-500 shadow-[0_0_6px_#10B981]" />
            <span className="text-[#f0fdf4]">PCI &gt; 75 (Smooth)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded bg-amber-500 shadow-[0_0_6px_#F59E0B]" />
            <span className="text-[#f0fdf4]">PCI 50-74 (Moderate)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded bg-rose-500 shadow-[0_0_6px_#EF4444]" />
            <span className="text-rose-400 font-bold">PCI &lt; 50 (Potholes)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
