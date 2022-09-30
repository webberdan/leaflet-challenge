const usCenter = [39.8283, -98.5795]
const mapZoomLevel = 5

// Create the tile layer for map background

function createMap(eqLayer)
{
    // Create the tile layer that will be the background of our map.
    const streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create the map object with options.
  var map = L.map("map", {
    center: usCenter,
    zoom: mapZoomLevel,
    layers: [streetmap, eqLayer]
    });

    //Create Map Legend
    // make a variable for the legend and position it in the bottom right of the screen
    var legend = L.control(
        {
            position: "bottomright"
        }
    );
    // add the properties for the legend
  legend.onAdd = function ()
  {
    // create a div for the legend
    var div = L.DomUtil.create("div", "info legend");
    console.log(div);
    var intervals = [0, 10, 30, 50, 70, 90]; // this array represents the intervals
                                 // for the capacities of the bike stations
    // this array represents the colors that will be associated with the intervals
    // (populate these in reverse)
    var colors = [
        "green",
        "yellow",
        "blue",
        "orange",
        "pink",
        "red"
    ];
    // use a loop to generate labels within the div
    // div starts as empty, then is populated with the data from the arrays
    for(var i = 0; i < intervals.length; i++)
    {
        // display the colors and the interval values
        //console.log(colors[i]);
        //console.log(intervals[i]);
        // use .innerHTML to set the value of the color and the text for the interval
        div.innerHTML += "<i style='background: " + colors[i] + "'></i>"
        + intervals[i]
        + (intervals[i + 1] ? " &ndash; " + intervals[i+1] + "m depth<br>" :
        " or greater depth");
    }
    return div;
  };
  // add the legend to the map
  legend.addTo(map);
    




}

// Create the earthquake data layer

function createMarkers(data){
   const earthquake =  data.features
   console.log(earthquake.length)
   console.log(data)

   const depth1 = []
   const depth2 = []
   const depth3 = []
   const depth4 = []
   const depth5 = []
   const depth6 = []
   

   for(var i = 0; i < earthquake.length; i++)
   {
        const markerRadius = earthquake[i].properties.mag * 10000

        var markerColor;
        if(earthquake[i].geometry.coordinates[2] > 90)
                markerColor = "red";
        else if(earthquake[i].geometry.coordinates[2] >= 70)
                markerColor = "pink";
        else if(earthquake[i].geometry.coordinates[2] >= 50)
                markerColor = "orange";
        else if(earthquake[i].geometry.coordinates[2] >= 30)
                markerColor = "blue";
        else if(earthquake[i].geometry.coordinates[2] >= 10)
                markerColor = "yellow";
        else 
            markerColor = "green";

    
        const eqCircle = L.circle([earthquake[i].geometry.coordinates[1], earthquake[i].geometry.coordinates[0]], {
            fillOpacity: .30,
            color: markerColor,
            fillColor: markerColor,
            radius: markerRadius,
            weight: 1
        })
        .bindPopup(`<h2>ID: ${earthquake[i].properties.ids}</h2><hr><h2>Location: ${earthquake[i].properties.place}</h2><hr><b><h2>Magnitude: ${earthquake[i].properties.mag}</h2><hr><b><h2>Depth: ${earthquake[i].geometry.coordinates[2]}</h2> `);

        //Add earthquake marker to array by using eqCircle.push
        if(earthquake[i].geometry.coordinates[2] > 90)
            depth6.push(eqCircle);
        else if(earthquake[i].geometry.coordinates[2] > 70)
            depth5.push(eqCircle)
        else if(earthquake[i].geometry.coordinates[2] > 50)
            depth4.push(eqCircle)
        else if(earthquake[i].geometry.coordinates[2] > 30)
            depth3.push(eqCircle)
        else if(earthquake[i].geometry.coordinates[2] > 10)
            depth2.push(eqCircle)
        else 
            depth1.push(eqCircle)
   }
   const earthquakeLayer = L.layerGroup(depth1,depth2,depth3,depth4,depth5,depth6)
   createMap(earthquakeLayer)
   console.log(depth2)
}

//API call to earthquake JSON
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
  
   