/*
This is for OpenStreetMap's XML format described at:
https://wiki.openstreetmap.org/wiki/OSM_XML

OpenStreetMap is a mapping API service and open data.
The XML format is one of many formats used by OpenStreetMap to share its data.
*/
class OSMFileFormat extends PointCloudFileFormat {
	constructor() {
		super();
		this.accept = '.osm';
	}

	getOSMFromText(content) {
		var xmlDoc;
		if (window.DOMParser)
		{
			var parser = new DOMParser();
			xmlDoc = parser.parseFromString(content, "text/xml");
		}
		else // Internet Explorer
		{
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = false;
			xmlDoc.loadXML(content);
		}
		var osm = xmlDoc.getElementsByTagName('osm');
		if (!osm) {
			var msg = 'No osm element found in document.  Invalid OSM XML content';
			console.error(msg);
			throw new Error(msg);
		}
		return osm[0];
	}

	_loadFromVertices(content, defaultRGB) {
		var osm = this.getOSMFromText(content);
		var nodes = osm.querySelectorAll('node[lon][lat]');
		var result = [];
		nodes.forEach(function(node) {
			var lat = parseFloat(node.getAttribute('lat').trim());
			var lon = parseFloat(node.getAttribute('lon').trim());
			if (!isNaN(lat) && !isNaN(lon))
				result.push(new Point([lat, lon, 0], defaultRGB.r, defaultRGB.g, defaultRGB.b));
		});
		return result;
	}

	loadFromFile(file, defaultRGB) {
		if (typeof defaultRGB !== 'object')
			defaultRGB = {'r': 0, 'g': 0, 'b': 0};
		var reader = new FileReader();
		reader.readAsText(file, "UTF-8");
		var outer = this;
		return new Promise(function(resolver, rejecter) {
			reader.onload = function (evt) {
				var content = evt.target.result;
				resolver(outer._loadFromVertices(content, defaultRGB));
			};
		});
	}
}