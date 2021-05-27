import {initMeshLoader} from './meshLoader.js';
import {Renderer} from './Renderer.js';
import {PLYFileFormatExporter} from 'https://joshi1983.github.io/pages/treeModelGenerator/modules/PLYFileFormatExporter.js';
import {setUpDragUI} from './dragUI.js';

document.addEventListener('DOMContentLoaded', function() {
	var renderer = new Renderer();
	setUpDragUI(renderer);
	initMeshLoader(renderer);
	var scaleFactor = document.getElementById('scale-factor');
	var download = document.getElementById('download-mesh');
	download.addEventListener('click', function() {
		var exporter = new PLYFileFormatExporter();
		var blob = exporter.trianglesToBlob(renderer.triangles);
		var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "meshViewerDownload.ply";
		a.click();
	});
	function scaleFactorUpdated() {
		renderer.scaleFactor = parseFloat(scaleFactor.value);
		renderer.resized();
	}
	scaleFactor.addEventListener('input', scaleFactorUpdated);
	scaleFactorUpdated();
});