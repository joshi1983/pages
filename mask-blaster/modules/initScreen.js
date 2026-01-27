import { ready } from './ready.js';

// When clicking on the init screen, guide the user to click 'Start Blasting'.
// A lot of the code here is for doing that.
// Upon clicking on the init-screen, a circle appears and moves to 

let movingPointers = [];
let button, lastRefreshTime;
let initScreen, clickMessage, removeShowClickMessageTimeOut;
const toPos = {'x': 100, 'y': 0};
const maxT = 500;

function accelerateRatio(ratio) {
	return Math.sqrt(ratio);
}

function getUniqueId() {
	for (let i = 1; true; i++) {
		const id = 'init-screen-circle-' + i;
		if (document.getElementById(id) === null)
			return id;
	}
}

function refreshToPos() {
	if (button !== undefined) {
		const buttonBox = button.getBoundingClientRect();
		toPos.x = buttonBox.left + buttonBox.width / 2;
		toPos.y = buttonBox.top + buttonBox.height / 2;
	}
}

function startPointer(x, y) {
	if (typeof x !== 'number' || typeof y !== 'number')
		throw new Error(`x and y must be a number but found x=${x}, y=${y}`);

	clickMessage.classList.add('show');
	if (removeShowClickMessageTimeOut !== undefined) {
		clearTimeout(removeShowClickMessageTimeOut);
		removeShowClickMessageTimeOut = undefined;
	}
	
	movingPointers.push({
		'from': {'x': x, 'y': y},
		'timeRemaining': maxT
	});
	if (lastRefreshTime === undefined) {
		lastRefreshTime = Date.now();
		updateAnimation(); // start animating.
	}
}

function updateAnimation() {
	const newTime = Date.now();
	const delta = lastRefreshTime === undefined ? 0 : newTime - lastRefreshTime;
	const toRemove = [];
	for (const movingPointer of movingPointers) {
		movingPointer.timeRemaining -= delta;
		if (movingPointer.timeRemaining < 0)
			toRemove.push(movingPointer);
		else {
			const ratio = accelerateRatio(movingPointer.timeRemaining / maxT);
			const ratio2 = 1 - ratio;
			const from = movingPointer.from;
			const pos = {
				'x': toPos.x * ratio2 + from.x * ratio,
				'y': toPos.y * ratio2 + from.y * ratio
			};
			let e;
			if (movingPointer.id === undefined && initScreen !== undefined) {
				movingPointer.id = getUniqueId();
				e = document.createElement('div');
				e.classList.add('circle');
				e.id = movingPointer.id;
				initScreen.appendChild(e);
			}
			else
				e = document.getElementById(movingPointer.id);

			const box = e.getBoundingClientRect();
			const radius = box.width / 2;
			e.style.left = '' + Math.round(pos.x - radius) + 'px';
			e.style.top = '' + Math.round(pos.y - radius) + 'px';
		}
	}
	for (const p of toRemove) {
		const index = movingPointers.indexOf(p);
		if (p.id !== undefined) {
			document.getElementById(p.id).remove(); // remove the element.
		}
		movingPointers.splice(index, 1);
	}
	if (movingPointers.length !== 0) {
		requestAnimationFrame(updateAnimation);
		lastRefreshTime = Date.now();
	}
	else {
		lastRefreshTime = undefined;
		delayedRemoveShowClickMessage();
	}
}

function delayedRemoveShowClickMessage() {
	if (removeShowClickMessageTimeOut !== undefined)
		clearTimeout(removeShowClickMessageTimeOut);

	removeShowClickMessageTimeOut = setTimeout(function() {
		clickMessage.classList.remove('show');
	}, 1000);
}

function init() {
	button = document.querySelector('.init-screen button');
	initScreen = document.querySelector('.init-screen');
	clickMessage = document.getElementById('click-message');
	initScreen.addEventListener('mousedown', function(event) {
		const target = event.target;
		if (target === button)
			return;
		startPointer(event.clientX, event.clientY);
	});
	refreshToPos();
}

ready(init);
window.addEventListener("resize", refreshToPos);