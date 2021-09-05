import { downloadDataUrl } from '../../modules/components/downloadDataUrl.js';
import { ready } from '../../modules/ready.js';

const mime = 'image/avif';

function downloadAvif() {
	const canvas = document.createElement('canvas');
	canvas.setAttribute('width', 3);
	canvas.setAttribute('height', 3);
	const ctx = canvas.getContext('2d');
	ctx.stokeStyle = '#f00';
	ctx.lineTo(3,3);
	ctx.stroke();
	const imageDataUrl = canvas.toDataURL(mime);
	downloadDataUrl(mime, imageDataUrl);
}

function init() {
	const button = document.getElementById('download');
	button.addEventListener('click', downloadAvif);
}

ready(init);