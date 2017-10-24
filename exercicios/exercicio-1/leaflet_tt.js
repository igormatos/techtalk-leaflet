var regionGeoJs2;
var colorset = ['#fef0d9' , '#fdd49e' , '#fdbb84' ,'#fc8d59' ,'#ef6548' ,'#d7301f' , '#990000'];
var colorScale = d3.scaleQuantize()
        .domain([ 70, 100])
        .range(colorset);

var init = function()
{
	var map = L.map("map").setView([47.58,1.33],7);

	var OpenStreetMap_France = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
	maxZoom: 20,
	attribution: '&copy; Openstreetmap France | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	//L.marker([47.5656,1.36]).addTo(map).bindPopup("My city is <b> Saint Gervais la Foret </b>");

	var regionGeoJs = new L.GeoJSON(region, {
		style : {
			weight : 1,
			opacity: 1,
			color: "#66cc66",
			fillOpacity: 0.1
		}
	}).addTo(map);


	// calculo dos meios


	var centroid = L.geoJson(region, {
		onEachFeature: function(feature){
			var centroid = turf.centroid(feature);
			var lon = centroid.geometry.coordinates[0];
			var lat = centroid.geometry.coordinates[1];
			L.circleMarker([lat,lon], {
				radius : calc_rayon(feature.properties.rvn),
				color : '#005824',
				fillOpacity : 0.5,
				fillColor: "#41AE76"
			}).addTo(map).bindPopup("Salario bruto por habitantes de regiao "+feature.properties.nom+" : "+feature.properties.rvn+"\u20AC");
		}
	});


	var titre = L.control();

	titre.onAdd = function(map) {
		var divTitre = L.DomUtil.create('div', 'titre');
		divTitre.innerHTML = "<h4> Salario bruto por habitantes nas regioes francesas em 2013 </h4>";
		return divTitre;
	};

	titre.addTo(map);


}


var calc_rayon = function(rvn)
{
	rvn = rvn/10000;
	var rayon = (Math.pow(4,rvn));
	return rayon;
}


var init2 = function()
{
	var map = L.map("map").setView([47.58,1.33],7);

	var OpenStreetMap_France = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
	maxZoom: 20,
	attribution: '&copy; Openstreetmap France | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	regionGeoJs2 = L.geoJson(region, {
		style: regionStyle,
		onEachFeature: evenement
	}).addTo(map);


	var svg = d3.select("body").append("svg").attr("width",300).attr("height",300);

  	var colorLegend = d3.legendColor()
    .labelFormat(d3.format(".0f"))
    .scale(colorScale)
    .shapePadding(5)
    .shapeWidth(50)
    .shapeHeight(20)
    .labelOffset(12);

  	svg.append("g")
    .attr("transform", "translate(0,20)")
    .call(colorLegend);

    info = L.control();

    info.onAdd = function(map)
    {
    	this._div = L.DomUtil.create('div','info');
    	this.update();
    	return this._div;
    };

    info.update = function(props)
    {
    	this._div.innerHTML = '<h4>Percentagem do salario bruto em Ile-de-France (2013) </h4>'
    	+(props ? '<b>'+props.nom+'</b><br />'+(100*(props.rvn/24035))+' %'
    		: 'Passar o mouse em cima de uma regiao <br>');
    };

    info.addTo(map);
}


var regionStyle =  function(feature)
{
	return{
		fillColor: getColor(feature.properties.rvn), // va décider de la couleur de la région
		weight: 2,
		opacity: 0.9,
		color: 'white',
		fillOpacity: 0.7
	};
}


var getColor = function(rvn)
{
	var pourcentage = 100*(rvn/24035);
      return colorScale(pourcentage);
};

var evenement = function(feature, layer)
{
	layer.on({
		mouseover: affiche,
		mouseout: desaffiche
	});
};

var affiche = function(e)
{
	info.update(e.target.feature.properties);
}

var desaffiche =  function(e)
{
	info.update();
}
							
							
							
							