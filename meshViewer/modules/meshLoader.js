import {CompositeMeshFileFormatImporter} from './CompositeMeshFileFormatImporter.js';

export function initMeshLoader(renderer) {
	var fileSelector = document.getElementById('upload-mesh');
	var format = new CompositeMeshFileFormatImporter();
	fileSelector.setAttribute('accept', format.accept);
	fileSelector.addEventListener('change', function(event) {
		var file = fileSelector.files[0];
		if (file) {
			format.loadFromFile(file, {'r': 1, 'g': 1, 'b': 1}).then(function(triangles) {
				renderer.setTriangles(triangles);
			});
		}
	});
}