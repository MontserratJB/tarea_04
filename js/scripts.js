// Mapa Leaflet
var mapa = L.map('mapid').setView([9.5, -84.10], 8);


// Definición de capas base
var capa_osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
  {
    maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapa);

var capa_cartoDB_darkMatter = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', 
    {
	  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	  subdomains: 'abcd',
	  maxZoom: 19
    }
).addTo(mapa);


// Conjunto de capas base
var capas_base = {
  "OSM": capa_osm,
  "CartoDB Dark Matter": capa_cartoDB_darkMatter
};	    


// Ícono personalizado para Cuerpos de agua
const iconoCagua = L.divIcon({
  html: '<i class="fas fa-tint fa-2x"></i>',
  className: 'estiloIconos'
});

// Ícono personalizado para Centros educativos
const iconoColegios = L.divIcon({
  html: '<i class="fas fa-school fa-2x"></i>',
  className: 'estiloIconos'
});

// Control de capas
control_capas = L.control.layers(capas_base).addTo(mapa);	


// Control de escala
L.control.scale().addTo(mapa);
   

// Capa vectorial de registros de Cuerpos de agua
$.getJSON("https://raw.githubusercontent.com/MontserratJB/tarea_04/master/ign/otros_cuerpos_de_agua.geojson", function(geodata) {
  // Capa de registros individuales
  var cuerpos_agua = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#013220", 'weight': 3}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Codigo</strong>: " + feature.properties.codigo + "<br>" + 
                      "<strong>Origen</strong>: " + feature.properties.origen + "<br>" + 
                      "<br>";
      layer.bindPopup(popupText);
    },
    pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng, {icon: iconoCagua});
    }
  });

  // Capa de puntos agrupados
  var capa_cagua_agrupados = L.markerClusterGroup({spiderfyOnMaxZoom: true});
  capa_cagua_agrupados.addLayer(cuerpos_agua);

  // Se añaden las capas al mapa y al control de capas
  capa_cagua_agrupados.addTo(mapa);
  control_capas.addOverlay(capa_cagua_agrupados, 'Cuerpos de agua');

});

// Capa vectorial de centros educativos de CR
$.getJSON("https://raw.githubusercontent.com/MontserratJB/tarea_04/master/ign/colegios_mep.geojson", function(geodata) {
  // Capa de registros individuales
  var capa_colegios = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#013220", 'weight': 3}
    },
    pointToLayer: function(getJsonPoint, latlng) {
        return L.marker(latlng, {icon: iconoColegios});
    }
  });

  // Capa de calor (heatmap)
  coordenadas = geodata.features.map(feat => feat.geometry.coordinates.reverse());
  var capa_colegios_calor = L.heatLayer(coordenadas, {radius: 40, blur: 20, max: 0.03});

  // Se añaden las capas al mapa y al control de capas
  capa_colegios_calor.addTo(mapa);
  control_capas.addOverlay(capa_colegios_calor, 'Mapa de calor CE');
  
});
  
  
  
  
  
  
