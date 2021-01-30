var pointsData = [];

function getPointCoordinatesData() {
	var newVal = [];
	pointsData.forEach(function(point) {
		for (var i = 0; i < point.coords.length;i++) {
		
			newVal.push(point.coords[i]);
		}
	});
	return newVal;
}

function getPointColoursData() {
	var newVal = [];
	pointsData.forEach(function(point) {
		newVal.push(point.r);
		newVal.push(point.g);
		newVal.push(point.b);
	});
	return newVal;
}
