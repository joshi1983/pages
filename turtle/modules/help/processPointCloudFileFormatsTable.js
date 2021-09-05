import { PointCloudFileFormats } from '../drawing-menu/download/point-clouds/PointCloudFileFormats.js';
import { processHyperlinks } from '../components/syntax-highlighter/processHyperlinks.js';
const id = 'point-cloud-exporter-file-formats';

export function processPointCloudFileFormatsTable(e) {
	if (e === undefined)
		e = document.getElementById(id);
	else if (e.id !== id)
		e = e.querySelector('#' + id);
	if (e !== null) {
		e.innerText = '';
		const data = PointCloudFileFormats.getAllData();
		data.forEach(function(formatInfo) {
			const formatDiv = document.createElement('div');
			const formatHeaderDiv = document.createElement('div');
			formatHeaderDiv.classList.add('header');
			const nameDiv = document.createElement('div');
			nameDiv.innerText = formatInfo.name;
			nameDiv.classList.add('name');
			formatHeaderDiv.appendChild(nameDiv);
			const extensionDiv = document.createElement('div');
			extensionDiv.innerText = '.' + formatInfo.fileExtension;
			formatHeaderDiv.appendChild(extensionDiv);
			formatDiv.appendChild(formatHeaderDiv);

			if (formatInfo.description !== undefined) {
				const descriptionDiv = document.createElement('div');
				descriptionDiv.classList.add('description');
				descriptionDiv.innerHTML = processHyperlinks(formatInfo.description);
				formatDiv.appendChild(descriptionDiv);
			}
			const footerDiv = document.createElement('div');
			footerDiv.classList.add('point-cloud-format-footer');
			const softwareDiv = document.createElement('div');
			softwareDiv.classList.add('software');
			const ul = document.createElement('ul');
			if (formatInfo.opensWith instanceof Array) {
				const span = document.createElement('span');
				span.innerText = 'Opens with:';
				softwareDiv.appendChild(span);
				formatInfo.opensWith.forEach(function(appInfo) {
					const li = document.createElement('li');
					li.innerHTML = processHyperlinks(appInfo);
					ul.appendChild(li);
				});
			}
			softwareDiv.appendChild(ul);
			footerDiv.appendChild(softwareDiv);
			const colourDiv = document.createElement('div');
			colourDiv.classList.add('indicates-colour');
			if (formatInfo.supportsColour) {
				colourDiv.innerText = 'Stores Color';
			}
			else {
				colourDiv.innerText = 'No Color';
				colourDiv.classList.add('no-color');
			}
			footerDiv.appendChild(colourDiv);
			formatDiv.appendChild(footerDiv);
			e.appendChild(formatDiv);
		});
	}
};