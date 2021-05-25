document.addEventListener('DOMContentLoaded', function() {
	var button = document.getElementById('download-csv');
	button.addEventListener('click', function() {
		var animation = new Animation();
		var objects = [];
		var blurFrameCount = 20;
		var keys = new Set();
		for (var i = 0; i < animation.getMaxTime(); i++) {
			for (var j = 0; j < blurFrameCount; j++) {
				var t = i + j * 0.5 / blurFrameCount;
				var props = animation.getPropertiesForTime(t).uiSettings;
				Object.keys(props).forEach(keys.add, keys);
				objects.push(props);
			}
		}
		
		keys = Array.from(keys);
		var csvData = [keys];
		objects.forEach(function(object) {
			csvData.push(keys.map(function(key) {
				if (object[key] === undefined)
					return 0;
				else
					return object[key];
			}));
		});
		var csvContent = csvData.map(function(csvRow) {
			return csvRow.join(",");
		}).join("\n");
		let csvBlob = new Blob([csvContent], { type: 'text/csv' });
		var dataURL = URL.createObjectURL(csvBlob);
		var a = document.createElement('a');
		a.setAttribute('download', 'animation.csv');
		a.setAttribute('href', dataURL);
		a.click();
	});
});