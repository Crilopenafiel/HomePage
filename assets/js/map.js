/* ================================================================
   map.js - Leaflet Interactive World Map with Category Filters
   ================================================================ */

(function () {
  'use strict';

  const mapEl = document.getElementById('world-map');
  if (!mapEl) return;

  if (typeof L === 'undefined') {
    mapEl.innerHTML = '<ul class="map-fallback" style="padding:1.5rem 0;">' +
      '<li><strong>Brisbane</strong>: Glencore, Senior Manager Digital Analytics & OT</li>' +
      '<li><strong>Melbourne</strong>: Tiger Spider, Product Manager / University of Melbourne</li>' +
      '<li><strong>Santiago</strong>: Codelco HQ, Corporate Director Digital Transformation</li>' +
      '<li><strong>Rancagua</strong>: Codelco El Teniente, Director of Innovation</li>' +
      '<li><strong>Antofagasta</strong>: Antofagasta PLC, Mining & Process Engineer</li>' +
      '<li><strong>Rotterdam</strong>: HVTT15 Conference, Paper Presentation</li>' +
      '<li><strong>Hangzhou</strong>: FLAC/DEM Symposium, Paper Presentation</li>' +
      '</ul>';
    return;
  }

  /* ----------------------------------------------------------------
     City data - each marker has one or more categories
  ---------------------------------------------------------------- */
  const cities = [
    {
      name: 'Brisbane',
      country: 'Australia',
      lat: -27.4698, lng: 153.0251,
      categories: ['work'],
      title: 'Senior Manager, Digital Analytics & OT',
      org: 'Glencore',
      period: 'Oct 2023 – Present',
      achievement: '$25M+ CAPEX digital optimisation portfolio aimed at improving business and industrial processes.'
    },
    {
      name: 'Melbourne',
      country: 'Australia',
      lat: -37.8136, lng: 144.9631,
      categories: ['work', 'study'],
      title: 'Product Manager / Master of Information Systems',
      org: 'Tiger Spider / University of Melbourne',
      period: 'Feb 2016 – Dec 2018 / 2015–2016',
      achievement: 'ANZ Innovation Hackathon Winner 2016. Becas Chile scholarship recipient.'
    },
    {
      name: 'Santiago',
      country: 'Chile',
      lat: -33.4489, lng: -70.6693,
      categories: ['work', 'study'],
      title: 'Corporate Director of Digital Transformation',
      org: 'Codelco / Universidad de Chile',
      period: 'Dec 2019 – Feb 2021',
      achievement: '9.7% copper grade uplift via ML prescriptive models at Chuquicamata.'
    },
    {
      name: 'Rancagua',
      country: 'Chile',
      lat: -34.1701, lng: -70.7444,
      categories: ['work'],
      title: 'Director of Innovation',
      org: 'Codelco El Teniente',
      period: 'Jan 2019 – Nov 2019',
      achievement: '6.06% fine copper uplift via XGBoost/EMCEE SAG mill optimisation.'
    },
    {
      name: 'Antofagasta',
      country: 'Chile',
      lat: -23.6509, lng: -70.3975,
      categories: ['work'],
      title: 'Mining & Process Engineer',
      org: 'Antofagasta PLC',
      period: '2013 – 2015',
      achievement: 'In-house truck dispatch system, 18% reduction in fleet idle time.'
    },
    {
      name: 'Calama',
      country: 'Chile',
      lat: -22.454, lng: -68.9293,
      categories: ['work'],
      title: 'Mining Engineering Internship',
      org: 'Codelco Radomiro Tomic',
      period: '2012',
      achievement: 'Field experience in open-pit copper mining operations.'
    },
    {
      name: 'Rotterdam',
      country: 'Netherlands',
      lat: 51.9244, lng: 4.4777,
      categories: ['conference'],
      title: 'Conference Presentation, HVTT15',
      org: 'International Symposium on Heavy Vehicle Transport Technology',
      period: '2018',
      achievement: '"Leveraging Cloud Computing for Heavy Vehicle Optimisation"'
    },
    {
      name: 'Hangzhou',
      country: 'China',
      lat: 30.2741, lng: 120.1551,
      categories: ['conference'],
      title: 'Conference Presentation, FLAC/DEM Symposium',
      org: 'Itasca International Symposium',
      period: '2013',
      achievement: '"Application of Synthetic Rock Mass at El Teniente Mine"'
    },
    // ── New Work Markers ──
    {
      name: 'Chuquicamata',
      country: 'Chile',
      lat: -22.3167, lng: -68.9333,
      categories: ['work'],
      title: 'ML Prescriptive Models',
      org: 'Codelco',
      period: '2020',
      achievement: '9.7% copper grade uplift via ML prescriptive models at Chuquicamata.'
    },
    {
      name: 'Lubin',
      country: 'Poland',
      lat: 51.3942, lng: 16.2015,
      categories: ['work'],
      title: 'Technology & Innovation Exchange',
      org: 'Lubin Mine',
      period: '2019',
      achievement: 'Visit to Lubin mine for exchange of technological and innovation learnings.'
    },
    {
      name: 'East Providence',
      country: 'USA',
      lat: 41.8137, lng: -71.3701,
      categories: ['work'],
      title: 'Technological Roadmapping',
      org: 'Glencore',
      period: '2022',
      achievement: 'Technological roadmapping of electronics recycling facility: processing end-of-life electronics, lithium-ion batteries for circular economy, copper-bearing scrap, and other metal-bearing materials.'
    },
    {
      name: 'Altonorte, Antofagasta',
      country: 'Chile',
      lat: -23.5975, lng: -70.3827,
      categories: ['work'],
      title: 'Smelter Oxygen Control Stabilisation',
      org: 'Glencore Altonorte',
      period: '2024',
      achievement: 'Glencore Altonorte smelter oxygen control stabilisation project.'
    },
    {
      name: 'Antapaccay',
      country: 'Peru',
      lat: -14.9833, lng: -71.3500,
      categories: ['work'],
      title: 'ML & Model Predictive Control',
      org: 'Glencore',
      period: '2024',
      achievement: '2.7% copper grade uplift via ML prescriptive models and Model Predictive Control deployment.'
    },
    {
      name: 'Kolwezi',
      country: 'DRC (Congo)',
      lat: -10.7167, lng: 25.4667,
      categories: ['work'],
      title: 'Instrumentation Modernisation & Cybersecurity',
      org: 'KCC Mine, Glencore',
      period: '2023',
      achievement: 'Instrumentation modernisation strategy, gap analysis, baselining. Mine network improvement and IT/OT cybersecurity program.'
    },
    {
      name: 'Montreal',
      country: 'Canada',
      lat: 45.5017, lng: -73.5673,
      categories: ['work'],
      title: 'Technological Roadmapping',
      org: 'CCR Refinery, Glencore',
      period: '2022',
      achievement: 'Technological roadmapping at CCR refinery.'
    },
    {
      name: 'Rouyn-Noranda',
      country: 'Canada',
      lat: 48.2364, lng: -79.0168,
      categories: ['work'],
      title: 'Technological Roadmapping',
      org: 'Horne Smelter, Glencore',
      period: '2022',
      achievement: 'Technological roadmapping at Horne smelter.'
    },
    {
      name: 'Johannesburg',
      country: 'South Africa',
      lat: -26.2041, lng: 28.0473,
      categories: ['work'],
      title: 'Data Science & Automation Team',
      org: 'Glencore Copper',
      period: '2022',
      achievement: 'Created data science, automation, and data engineering team at Glencore Copper. Executed first short interval control projects for KCC.'
    },
    // ── New Conference Markers ──
    {
      name: 'Wroclaw',
      country: 'Poland',
      lat: 51.1079, lng: 17.0385,
      categories: ['conference'],
      title: 'Mining Goes Digital (APCOM 2019)',
      org: 'Proceedings of the 39th International Symposium APCOM',
      period: '2019',
      achievement: 'Part of Codelco committee presenting at Mining Goes Digital (2019), Proceedings of the 39th International Symposium "Application of Computers and Operations Research in the Mineral Industry."'
    },
    {
      name: 'Sydney (IMARC)',
      country: 'Australia',
      lat: -33.8688, lng: 151.2093,
      categories: ['conference'],
      title: 'Speaker at IMARC (Mines and Money)',
      org: 'IMARC',
      period: '2025',
      achievement: 'Panelist on "Augmenting Digitisation and AI Effectively" and "The Continuing Revolution of Mining through Automation." Interviewed on "Fail Fast, Learn Faster: Driving Agile Innovation in the Mining Industry." <a href="https://minesandmoney.com/imarc/speakers/cristian-lopez" target="_blank" rel="noopener noreferrer">Speaker profile</a>.'
    },
    {
      name: 'Cape Town',
      country: 'South Africa',
      lat: -33.9249, lng: 18.4241,
      categories: ['conference'],
      title: 'Mining Indaba Conference',
      org: 'Mining Indaba',
      period: '2024',
      achievement: 'Presented at Mining Indaba conference. Negotiated with regional providers to support the technology strategy in the Africa region.'
    },
    // ── New Study Markers ──
    {
      name: 'San Jose',
      country: 'USA',
      lat: 37.3382, lng: -121.8863,
      categories: ['study'],
      title: 'Scrum Master & Lean Six Sigma',
      org: 'Professional Certification',
      period: '2018',
      achievement: 'Scrum Master and Lean Six Sigma certifications.'
    },
    {
      name: 'Beijing',
      country: 'China',
      lat: 39.9042, lng: 116.4074,
      categories: ['study'],
      title: 'Mandarin Language & Technology Study',
      org: 'Study Program',
      period: '2016',
      achievement: 'Study of Mandarin language and understanding of sensor, instrumentation, and drone technologies.'
    },
    {
      name: 'Shanghai',
      country: 'China',
      lat: 31.2304, lng: 121.4737,
      categories: ['study'],
      title: 'Mandarin Language & Technology Study',
      org: 'Study Program',
      period: '2016',
      achievement: 'Study of Mandarin language and understanding of sensor, instrumentation, and drone technologies.'
    }
  ];

  /* ----------------------------------------------------------------
     Colour palette per category
  ---------------------------------------------------------------- */
  const COLORS = {
    work:       '#D4812A',
    study:      '#9B59B6',
    conference: '#4A7FA5'
  };

  /* Determine primary colour for a marker (first category) */
  function markerColor(city) {
    for (var i = 0; i < city.categories.length; i++) {
      if (COLORS[city.categories[i]]) return COLORS[city.categories[i]];
    }
    return '#8899AA';
  }

  /* Check if a marker has multiple categories */
  function isMultiCategory(city) {
    return city.categories.length > 1;
  }

  /* ----------------------------------------------------------------
     Custom circular SVG marker
  ---------------------------------------------------------------- */
  function makeIcon(city) {
    var color = markerColor(city);
    var svgMarkup;
    if (isMultiCategory(city)) {
      // Multi-category: gradient ring
      var c2 = COLORS[city.categories[1]] || color;
      svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">' +
        '<defs><linearGradient id="grad-' + city.name.replace(/[^a-zA-Z]/g, '') + '" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="' + color + '"/>' +
        '<stop offset="100%" stop-color="' + c2 + '"/>' +
        '</linearGradient></defs>' +
        '<circle cx="11" cy="11" r="9" fill="url(#grad-' + city.name.replace(/[^a-zA-Z]/g, '') + ')" fill-opacity="0.9" stroke="#0A1628" stroke-width="2"/>' +
        '<circle cx="11" cy="11" r="4" fill="#0A1628" fill-opacity="0.5"/>' +
        '</svg>';
    } else {
      svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">' +
        '<circle cx="11" cy="11" r="9" fill="' + color + '" fill-opacity="0.9" stroke="#0A1628" stroke-width="2"/>' +
        '<circle cx="11" cy="11" r="4" fill="#0A1628" fill-opacity="0.5"/>' +
        '</svg>';
    }
    return L.divIcon({
      html: svgMarkup,
      className: '',
      iconSize:   [22, 22],
      iconAnchor: [11, 11],
      popupAnchor:[0, -14]
    });
  }

  /* ----------------------------------------------------------------
     Initialise map
  ---------------------------------------------------------------- */
  var map = L.map('world-map', {
    center: [-5, 40],
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
  var allMarkers = [];

  cities.forEach(function (city) {
    var marker = L.marker([city.lat, city.lng], { icon: makeIcon(city) }).addTo(map);

    var popupHtml =
      '<h4>' + city.name + ', ' + city.country + '</h4>' +
      '<p><strong>' + city.title + '</strong><br>' +
      '<em>' + city.org + '</em><br>' +
      '<span style="font-family:var(--font-mono,monospace);font-size:0.72rem;color:#00BFA6;letter-spacing:.05em">' + city.period + '</span></p>' +
      '<p style="margin-top:0.5rem;font-style:italic;">' + city.achievement + '</p>';

    marker.bindPopup(popupHtml, {
      maxWidth: 300,
      closeButton: true
    });

    allMarkers.push({
      marker: marker,
      categories: city.categories
    });
  });

  /* ----------------------------------------------------------------
     Category filter logic
  ---------------------------------------------------------------- */
  var filterBtns = document.querySelectorAll('.map-filter-btn');

  function applyFilter(activeFilter) {
    allMarkers.forEach(function (entry) {
      var show = false;
      if (activeFilter === 'all') {
        show = true;
      } else {
        show = entry.categories.indexOf(activeFilter) !== -1;
      }
      if (show) {
        if (!map.hasLayer(entry.marker)) {
          entry.marker.addTo(map);
        }
      } else {
        if (map.hasLayer(entry.marker)) {
          map.removeLayer(entry.marker);
        }
      }
    });
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  /* ----------------------------------------------------------------
     Draw arc paths between cities in chronological order
  ---------------------------------------------------------------- */
  var chronoOrder = [
    'Hangzhou',
    'Santiago',
    'Calama',
    'Antofagasta',
    'Rancagua',
    'Melbourne',
    'Rotterdam',
    'Brisbane'
  ];

  var arcCoords = chronoOrder.map(function (name) {
    var city = cities.find(function (c) { return c.name === name; });
    return city ? [city.lat, city.lng] : null;
  }).filter(Boolean);

  for (var i = 0; i < arcCoords.length - 1; i++) {
    var from = arcCoords[i];
    var to   = arcCoords[i + 1];
    var mid  = midpointCurved(from, to);
    var path = [from, mid, to];

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
  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    var div = L.DomUtil.create('div');
    div.style.cssText = 'background:rgba(10,22,40,0.9);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;font-family:Outfit,sans-serif;font-size:12px;color:#8899AA;line-height:1.8;backdrop-filter:blur(8px);';
    div.innerHTML =
      '<div style="margin-bottom:4px;color:#E8ECF1;font-weight:600;letter-spacing:.05em;font-size:11px;">MARKER KEY</div>' +
      '<div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#D4812A;margin-right:6px;vertical-align:middle;"></span>Work</div>' +
      '<div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#9B59B6;margin-right:6px;vertical-align:middle;"></span>Study</div>' +
      '<div><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#4A7FA5;margin-right:6px;vertical-align:middle;"></span>Conference</div>';
    return div;
  };
  legend.addTo(map);

  /* ----------------------------------------------------------------
     Curved midpoint helper
  ---------------------------------------------------------------- */
  function midpointCurved(from, to) {
    var midLat = (from[0] + to[0]) / 2;
    var midLng = (from[1] + to[1]) / 2;
    var dLat = to[0] - from[0];
    var dLng = to[1] - from[1];
    var dist  = Math.sqrt(dLat * dLat + dLng * dLng);
    var offset = dist * 0.22;
    return [midLat - dLng / dist * offset, midLng + dLat / dist * offset];
  }

})();
