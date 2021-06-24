class CSVRecorder {
	constructor() {
		this.clear();
		this.downloadCSV = document.getElementById('download-csv');
		var outer = this;
		this.downloadCSV.addEventListener('click', function() {
			outer._downloadCSV();
		});
	}

	clear() {
		this.states = [];
		this.bladeAngle = 0;
	}

	record(a) {
		this.downloadCSV.removeAttribute('disabled');
		this.bladeAngle += a.controlState.bladeSpeed * a.timeInterval;
		var csvData = [a.realWorld.elevation, this.bladeAngle];
		
		this.states.push(csvData);
	}

	_downloadCSV() {
		var lines = ['y,blade-angle'];
		this.states.forEach(function(state) {
			lines.push(state.join(','));
		});
		var csvContent = lines.join('\n');
		let csvBlob = new Blob([csvContent], { type: 'text/csv' });
		var dataURL = URL.createObjectURL(csvBlob);
		var a = document.createElement('a');
		a.setAttribute('download', 'animation.csv');
		a.setAttribute('href', dataURL);
		a.click();
	}
}