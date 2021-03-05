import { PLYFileFormatExporter } from './modules/PLYFileFormatExporter.js'
import { Renderer } from './modules/Renderer.js'
import { initTreeSettings } from './modules/treeSettings.js'

document.addEventListener('DOMContentLoaded', function() {
	var renderer = new Renderer();
	setUpDragUI(renderer);
	initTreeSettings(renderer);
	var download = document.getElementById('download-mesh');
	download.addEventListener('click', function() {
		var exporter = new PLYFileFormatExporter();
		var blob = exporter.trianglesToBlob(renderer.triangles);
		var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "tree.ply";
		a.click();
	});
});