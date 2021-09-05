import { ready } from '../../modules/ready.js';

function draw() {
	const canvas = document.querySelector('canvas');
	const box = canvas.getBoundingClientRect();
	canvas.width = Math.floor(box.width);
	canvas.height = Math.floor(box.height);
	const context = canvas.getContext('2d');
	const x = 200, y = 200;
	const x2 = 150, y2 = 200;
	const x3 = 150, y3 = 350;
	const radius1 = 100;
	const radius2 = 50;
	const radius3 = 200;
	const startAngle = Math.PI * 0.1;
	const endAngle = Math.PI;
	const endAngle2 = Math.PI * 1.5;
	const endAngle3 = Math.PI * 1.78;
	context.lineWidth = 2;
	context.strokeStyle = '#00f';
	context.beginPath();
	context.arc(x3, y3, 5, 0, Math.PI * 2);
	context.stroke();
	context.closePath();
	context.strokeStyle = '#000';
	context.lineWidth = 50;
	context.beginPath();
	context.arc(x, y, radius1, startAngle, endAngle);
	context.arc(x2, y2, radius2, endAngle, endAngle2);
	context.arc(x3, y3, radius3, endAngle2, endAngle3);
	context.closePath();
	context.stroke();
}

ready(draw);