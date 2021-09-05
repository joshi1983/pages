const s = `
onmessage = function(e) {
	const [num1, num2] = e.data;
	postMessage(num1 + num2);
};
`;

// This takes some ideas from: https://stackoverflow.com/questions/66453798/web-workers-without-a-server
const worker = new Worker(
	URL.createObjectURL(
		new Blob([s])
	)
);

function onmessage(e) {
	document.getElementById('message').innerText = '' + e.data;
}

function onerror(e) {
	
}

worker.onmessage = onmessage;
worker.onerror = onerror;

function runCalculationInWorker() {
	worker.postMessage([3, 4]);
}

runCalculationInWorker();