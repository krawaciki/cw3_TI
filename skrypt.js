$(document).ready(function() {

	var indeks = 1;
	var nrfunk = 0;
	var pocz = 0;
	var kon = 0;
	var dl = 0;
	var pow = 0;
	var pierwszy = false;
	var drugi = false;
	var dx;
	var dy;
	var suma2P = 0;
	var punkty = new Array();
	var geojsonObject;
	var lat = 51.11345;
	var lng = 17.06275;
	var zoom = 14;
	var mapLayer = L.geoJson();
	var map = L.map('map').setView([lat, lng], zoom);
	map.doubleClickZoom.disable(); 
	
	$('#map').css('height',(window.innerHeight-20))

	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 20,
	}).addTo(map);
	$('#left').accordion()

		$('#Sek1').mouseup(function() {
			$('#left .ui-accordion-content').css("height","20px");
		});
		$('#Sek2').mouseup(function() {
			$('#left .ui-accordion-content').css("height","20px");
		});
		$('#Sek3').mouseup(function() {
			$('#left .ui-accordion-content').css("height","60px");
		});
		document.getElementById('ch1').checked = "checked";
		document.getElementById('ch2').checked = 0;
		document.getElementById('ch3').checked = 0;
		document.getElementById('ch4').checked = 0;
		document.getElementById('ch5').checked = 0;
		
		$('#ch1,#ch2,#ch3,#ch4,#ch5,#ch6').click(function() {
			map.remove();
			lat = map.getCenter().lat;
			lng = map.getCenter().lng;
			zoom = map.getZoom();
			map = L.map('map').setView([lat, lng], zoom);
			if (document.getElementById('ch1').checked == 1)
				{
					L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
						attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
						maxZoom: 18,
					}).addTo(map);
				}
			if (document.getElementById('ch2').checked == 1)
			{
				var mywms = L.tileLayer.wms("http://mapy.geoportal.gov.pl/wss/service/img/guest/TOPO/MapServer/WMSServer", {
			    	layers: 'Raster',
			    	format: 'image/png',
			    	transparent: false,
			    	version: '1.1.0',
			    	attribution: "myattribution"
				});
				mywms.addTo(map);
			}
			if (document.getElementById('ch3').checked == 1)
			{
				var mywms = L.tileLayer.wms("http://gis.um.wroc.pl/services/OGC_MPODST/MapServer/WMSServer", {
			    	layers: 'PokrycieTerenu, Wody, GranicaMiasta, ZielenWysoka, LinieKolejowe, Budynki, PowierzchnieUlic, ObrysyUlic, OsieUlic, PunktyAdresowe',
			    	format: 'image/png',
			    	transparent: false,
			    	version: '1.1.0',
			    	attribution: "myattribution"
				});
				mywms.addTo(map);
			}
		if (document.getElementById('ch4').checked == 1)
			{
				var mywms = L.tileLayer.wms("http://gis.um.wroc.pl/services/OGC_mpzp/MapServer/WMSServer", {
			    	layers: 'przeznaczenie_terenu_-_uproszczona_klasyfikacja, linie_podzialu_nieruchomosci, wydzielenie_wewnetrzne_dodatkowe, wydzielenia_wewnetrzne, tereny, granice_wydzielen_wewnetrznych, obowiazujace_plany_miejscowe',
			    	format: 'image/png',
			    	transparent: true,
			    	version: '1.1.0',
			    	attribution: "myattribution"
				});
				mywms.addTo(map);
			}
		if (document.getElementById('ch5').checked == 1)
			{
				var mywms = L.tileLayer.wms("http://gis.um.wroc.pl/services/ogc_orto/MapServer/WMSServer", {
			    	layers: 'ortofotomapa_2011',
			    	format: 'image/png',
			    	transparent: true,
			    	version: '1.1.0',
			    	attribution: "myattribution"
				});
				mywms.addTo(map);
			}
		});
	$('#wspolrzedne').click(function() {
		if (nrfunk==1)
		{
			nrfunk = 0;
		}
		else
		{
			nrfunk = 1;
		}
	});
	$('#dlugosc').click(function() {
		if (nrfunk==2)
		{
			nrfunk = 0
		}
		else
		{
			nrfunk = 2
		}
	});
	$('#powierzchnia').click(function() {
		if (nrfunk==3)
		{
			nrfunk = 0
		}
		else
		{
			nrfunk = 3
		}
	});
	$('#znacznik').click(function() {
		if (nrfunk==4)
		{
			nrfunk = 0
		}
		else
		{
			nrfunk = 4
		}
	});
	$('#kolo').click(function() {
		if (nrfunk==5)
		{
			nrfunk = 0
		}
		else
		{
			nrfunk = 5
		}
	});
			
		
	var popup = L.popup();

	function onMapClick(e) {
		if (nrfunk==1)
		{
			popup
				.setLatLng(e.latlng)
				.setContent("Szerokość geograficzna: " + e.latlng.lat.toFixed(4) + "<br /> Długość geograficzna: "+ e.latlng.lng.toFixed(4))
				.openOn(map);
		}
		if (nrfunk==2 && pierwszy==true)
		{
			kon = e.latlng;
			dl = pocz.distanceTo(kon);
			popup
				.setLatLng(e.latlng)
				.setContent("Odległość: " + (dl/1000).toFixed(4) + " km")
				.openOn(map);
			var prosta = {
			  "type": "LineString",
    			"coordinates": [ [pocz.lng, pocz.lat], [kon.lng, kon.lat] ]
   			};
   			mapLayer = L.geoJson(prosta);
   			map.addLayer(mapLayer);
			drugi = true;
		}
		if (nrfunk==2 && pierwszy==false && drugi==false)
		{
			pocz = e.latlng;
			map.removeLayer(mapLayer);
			pierwszy = true;
		}
		if (nrfunk==2 && pierwszy==true && drugi==true)
		{
			pierwszy = false
			drugi = false
		}
		if (nrfunk==3)
		{
			punkty[punkty.length] = [e.latlng.lng, e.latlng.lat];
			if (map.hasLayer(mapLayer))
			{
				map.removeLayer(mapLayer);
			}
		}
		if (nrfunk==4)
		{
			map.removeLayer(mapLayer);
			var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
		}
		if (nrfunk==5)
		{
			map.removeLayer(mapLayer);
			var promien = prompt("Wprowadź promień koła");
			if (promien != null) {
				try {
					var circle = L.circle([e.latlng.lat, e.latlng.lng], promien, {
		    			color: 'green',
		    				fillColor: '#e02',
		    				fillOpacity: 0.5
					}).addTo(map);
				}
				catch (e) {
    				alert('Błędna wartość!')
				}
			}
		}
		
	}
	map.on('click', onMapClick);
	
	function onDblClick(e) {
		if (nrfunk==3)
		{
			if (punkty.length>2)
			{
				geojsonObject = {
				  		"type": "Polygon",
	    				"coordinates": [punkty]
	    		}		
	   			mapLayer = L.geoJson(geojsonObject);
	   			map.addLayer(mapLayer);
	   			for (i=0; i<punkty.length-1; i++)
	   			{
	   				if (i==0)
	   				{
	   					dx = map.project(punkty[i+1]).x-map.project(punkty[punkty.length-1]).x;
	   					dy = map.project(punkty[i+1]).y-map.project(punkty[punkty.length-1]).y;
	   				}
	   				else if (i==punkty.length-1)
	   				{
	   					dx = map.project(punkty[0]).x-map.project(punkty[i-1]).x;
	   					dy = map.project(punkty[0]).y-map.project(punkty[i-1]).y;
	   				}
	   				else
	   				{
	   					dx = map.project(punkty[i+1]).x-map.project(punkty[i-1]).x;
	   					dy = map.project(punkty[i+1]).y-map.project(punkty[i-1]).y;
	   				}
					suma2P = suma2P + (map.project(punkty[i]).x)*dy;
	   				
	   			}
					popup
					.setLatLng(e.latlng)
					.setContent("Powierzchnia: " + Math.abs(suma2P/2000000) + " km<sup>2</sup>")
					.openOn(map);
					punkty = [];
					suma2P = 0;
			}
			else
			{
				popup
					.setLatLng(e.latlng)
					.setContent("Zbyt mała liczba punktów")
					.openOn(map);
			}
		}
	}
	map.on('dblclick', onDblClick);
	
function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}


var marker1 = L.marker([51.1114, 17.0641]).addTo(map);
var marker2 = L.marker([51.1078, 17.0616]).addTo(map);
var marker3 = L.marker([51.1140, 17.0343]).addTo(map);
var marker4 = L.marker([51.1500, 17.0582]).addTo(map);

	$('#nast').click(function() {
		if (indeks>3){
			indeks = 1;
		}
		else {
			indeks = indeks+1;
		}
		 
		if (indeks==1)
		{
			map.setView([51.1114, 17.0641], 15);
			marker1.bindPopup("<b>Uniwersytet Przyodniczy</b><br><img src='images/UP.jpg'>").openPopup();
		}
		if (indeks==2)
		{
			map.setView([51.1078, 17.0616], 15);
			marker2.bindPopup("<b>Politechnika Wrocławska</b><br><img src='images/PW.jpg'>").openPopup();
		}
		if (indeks==3)
		{
			map.setView([51.1140, 17.0343], 15);
			marker3.bindPopup("<b>Uniwersytet Wrocławski</b><br><img src='images/UW.jpg'>").openPopup();
		}
		if (indeks==4)
		{
			map.setView([51.1500, 17.0582], 15);
			marker4.bindPopup("<b>Wyższa Szkoła Oficerska</b><br><img src='images/WSO.jpg'>").openPopup();
		}
	});
	
	$('#poprz').click(function() {
		if (indeks<2){
			indeks = 4;
		}
		else {
			indeks = indeks-1;
		}
		 
		if (indeks==1)
		{
			map.setView([51.1114, 17.0641], 15);
			marker1.bindPopup("<b>Uniwersytet Przyodniczy</b><br><img src='images/UP.jpg'>").openPopup();
		}
		if (indeks==2)
		{
			map.setView([51.1078, 17.0616], 15);
			marker2.bindPopup("<b>Politechnika Wrocławska</b><br><img src='images/PW.jpg'>").openPopup();
		}
		if (indeks==3)
		{
			map.setView([51.1140, 17.0343], 15);
			marker3.bindPopup("<b>Uniwersytet Wrocławski</b><br><img src='images/UW.jpg'>").openPopup();
		}
		if (indeks==4)
		{
			map.setView([51.1500, 17.0582], 15);
			marker4.bindPopup("<b>Wyższa Szkoła Oficerska</b><br><img src='images/WSO.jpg'>").openPopup();
		}
	});


});