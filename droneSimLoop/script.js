document.addEventListener('DOMContentLoaded', function() {
	var drawing = new Drawing();
	var csvRecorder = new CSVRecorder();
	var startButton = document.getElementById('start');
	startButton.addEventListener('click', function() {
		startSimulationLoop(drawing, csvRecorder);
	});
});