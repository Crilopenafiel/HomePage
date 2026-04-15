/* ================================================================
   map.js — Leaflet Interactive World Map
   ================================================================ */

(function () {
  'use strict';

  const mapEl = document.getElementById('world-map');
  if (!mapEl) return;

  if (typeof L === 'undefined') {
    mapEl.innerHTML = '<ul class="map-fallback" style="padding:1.5rem 0;">' +
      '<li><strong>Brisbane</strong> — Glencore, Senior Manager Digital Analytics &amp; OT</li>' +
      '<li><strong>Melbourne</strong> — Tiger Spider, Product Manager / University of Melbourne</li>' +
      '<li><strong>Santiago</strong> — Codelco HQ, Corporate Director Digital Transformation</li>' +
      '<li><strong>Rancagua</strong> — Codelco El Teniente, Director of Innovation</li>' +
      '<li><strong>Antofagasta</strong> — Antofagasta PLC, Mining &amp; Process Engineer</li>' +
      '<li><strong>Rotterdam</strong> — HVTT15 Conference, Paper Presentation</li>' +
      '<li><strong>Hangzhou</strong> — FLAC/DEM Symposium, Paper Presentation</li>' +
      '</ul>';
    return;
  }

  /* ----------------------------------------------------------------
     City data
  ---------------------------------------------------------------- */
  const cities = [
    {
      name: 'Brisbane',
      country: 'Australia',
      lat: -27.4698, lng: 153.0251,
      type: 'work',
      title: 'Senior Manager, Digital Analytics & OT',
      org: 'Glencore',
      period: 'Oct 2023 – Present',
      achievement: '$25M+ CAPEX digital optimisation portfolio across Glencore Copper globally'
    },
    {
      name: 'Melbourne',
      country: 'Australia',
      lat: -37.8136, lng: 144.9631,
      type: 'work-study',
      title: 'Product Manager / Master of Information Systems',
      org: 'Tiger Spider / University of Melbourne',
      period: 'Feb 2016 – Dec 2018 / 2015–2016',
      achievement: 'ANZ Innovation Hackathon Winner 2016 · Becas Chile scholarship recipient'
    },
    {
      name: 'Santiago',
      country: 'Chile',
      lat: -33.4489, lng: -70.6693,
      type: 'work-study',
      title: 'Corporate Director of Digital Transformation',
      org: 'Codelco / Universidad de Chile',
      period: 'Dec 2019 – Feb 2021',
      achievement: '9.7% copper grade uplift via ML prescriptive models at Chuquicamata'
    },
    {
      name: 'Rancagua',
      country: 'Chile',
      lat: -34.1701, lng: -70.7444,
      type: 'work',
      title: 'Director of Innovation',
      org: 'Codelco El Teniente',
      period: 'Jan 2019 – Nov 2019',
      achievement: '6.06% fine copper uplift via XGBoost/EMCEE SAG mill optimisation'
    },
    {
      name: 'Antofagasta',
      country: 'Chile',
      lat: -23.6509, lng: -70.3975,
      type: 'work',
      title: 'Mining & Process Engineer',
      org: 'Antofagasta PLC',
      period: '2013 – 2015',
      achievement: 'In-house truck dispatch system — 18% reduction in fleet idle time'
    },
    {
      name: 'Calama',
      country: 'Chile',
      lat: -22.454, lng: -68.9293,
      type: 'work',
      title: 'Mining Engineering Internship',
      org: 'Codelco Radomiro Tomic',
      period: '2012',
      achievement: 'Field experience in open-pit copper mining operations'
    },
    {
      name: 'Rotterdam',
      country: 'Netherlands',
      lat: 51.9244, lng: 4.4777,
      type: 'conference',
      title: 'Conference Presentation — HVTT15',
      org: 'International Symposium on Heavy Vehicle Transport Technology',
      period: '2018',
      achievement: '"Leveraging Cloud Computing for Heavy Vehicle Optimisation"'
    },
    {
      name: 'Hangzhou',
      country: 'China',
      lat: 30.2741, lng: 120.1551,
      type: 'conference',
      title: 'Conference Presentation — FLAC/DEM Symposium',
      org: 'Itasca International Symposium',
      period: '2013',
      achievement: '"Application of Synthetic Rock Mass at El Teniente Mine"'
    }
  ];

  /* ----------------------------------------------------------------
     Colour palette
  ---------------------------------------------------------------- */
  const COLORS = {
    work:        '#D4812A',  // copper
    'work-study': '#00BFA6', // teal
    conference:  '#4A7FA5'   // muted navy-blue
  };

  /* ----------------------------------------------------------------
     Custom circular SVG marker
  ---------------------------------------------------------------- */
  function makeIcon(type) {
    const color = COLORS[type] || '#8899AA';
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
        <circle cx="11" cy="11" r="9" fill="${color}" fill-opacity="0.9" stroke="#0A1628" stroke-width="2"/>
        <circle cx="11" cy="11" r="4" fill="#0A1628" fill-opacity="0.5"/>
      </svg>`;
    return L.divIcon({
      html: svg,
      className: '',
      iconSize:   [22, 22],
      iconAnchor: [11, 11],
      popupAnchor:[0, -14]
    });
  }

  /* ----------------------------------------------------------------
     Initialise map
  ---------------------------------------------------------------- */
  const map = L.map('world-map', {
    center: [-15, 95],
    zoom: 2,
    minZoom: 1,
    maxZoom: 8,
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: true
  });

  // Dark tile layer (CartoDB Dark Matter)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  /* ----------------------------------------------------------------
     Add markers
  ---------------------------------------------------------------- */
  const markerMap = {};

  cities.forEach(city => {
    const marker = L.marker([city.lat, city.lng], { icon: makeIcon(city.type) }).addTo(map);

    const popupHtml = `
      <h4>${city.name}, ${city.country}</h4>
      <p><strong>${city.title}</strong><br>
      <em>${city.org}</em><br>
      <span style="font-family:var(--font-mono,monospace);font-size:0.72rem;color:#00BFA6;letter-spacing:.05em">${city.period}</span></p>
      <p style="margin-top:0.5rem;font-style:italic;">${city.achievement}</p>
    `;

    marker.bindPopup(popupHtml, {
      maxWidth: 280,
      closeButton: true
    });

    markerMap[city.name] = marker;
  });

  /* ----------------------------------------------------------------
     Draw arc paths between cities in chronological order
     (simple curved polylines using intermediate bearing points)
  ---------------------------------------------------------------- */
  const chronoOrder = [
    'Hangzhou',   // 2013
    'Santiago',   // 2013–2021
    'Calama',     // 2012
    'Antofagasta',// 2013–2015
    'Rancagua',   // 2019
    'Melbourne',  // 2015–2018
    'Rotterdam',  // 2018
    'Brisbane'    // 2021–present
  ];

  const arcCoords = chronoOrder.map(name => {
    const city = cities.find(c => c.name === name);
    return city ? [city.lat, city.lng] : null;
  }).filter(Boolean);

  // Draw polyline arcs (curved approximation using intermediate points)
  for (let i = 0; i < arcCoords.length - 1; i++) {
    const from = arcCoords[i];
    const to   = arcCoords[i + 1];
    const mid  = midpointCurved(from, to);
    const path = [from, mid, to];

    L.polyline(path, {
      color: 'rgba(0,191,166,0.25)',
      weight: 1.2,
      dashArray: '4 6',
      lineCap: 'round'
    }).addTo(map);
  }

  /* ----------------------------------------------------------------
     Legend
  ---------------------------------------------------------------- */
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div');
    div.style.cssText = 'background:rgba(10,22,40,0.9);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;font-family:Outfit,sans-serif;font-size:12px;color:#8899AA;line-height:1.8;backdrop-filter:blur(8px);';
    div.innerHTML = `
      <div style="margin-bottom:4px;color:#E8ECF1;font-weight:600;letter-spacing:.05em;font-size:11px;">MARKER KEY</div>
      <div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#D4812A;margin-right:6px;vertical-align:middle;"></span>Work</div>
      <div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#00BFA6;margin-right:6px;vertical-align:middle;"></span>Work + Study</div>
      <div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#4A7FA5;margin-right:6px;vertical-align:middle;"></span>Conference</div>
    `;
    return div;
  };
  legend.addTo(map);

  /* ----------------------------------------------------------------
     Curved midpoint helper (offset perpendicular to path)
  ---------------------------------------------------------------- */
  function midpointCurved(from, to) {
    const midLat = (from[0] + to[0]) / 2;
    const midLng = (from[1] + to[1]) / 2;
    // Perpendicular offset proportional to distance
    const dLat = to[0] - from[0];
    const dLng = to[1] - from[1];
    const dist  = Math.sqrt(dLat * dLat + dLng * dLng);
    const offset = dist * 0.22;
    // Perpendicular direction
    return [midLat - dLng / dist * offset, midLng + dLat / dist * offset];
  }

})();
