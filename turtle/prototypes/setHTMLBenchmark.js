const lineCount = 200;
const htmlExample1 = '<span class="parameterized-group">print</span> <span class="string-literal">"hello</span>';
const htmlExample2 = 'prin <span class="string-literal">"hello</span>';
const htmlExample3 = 'prin <span class="string-literal">"hell</span>';

function getTime() {
	return new Date().getTime();
}

function createInitialState() {
	const e = [];
	for (let i = 0; i < lineCount; i++) {
		e[i] = htmlExample1 + ` print ${i}`;
	}
	return e;
}

function simulatedTyping(setter) {
	const e = createInitialState();
	const tStart = getTime();
	for (let i = 0; i < lineCount; i++) {
		e[i] = htmlExample2;
		setter.setHTMLLines(e);
	}
	for (let i = 0; i < lineCount; i++) {
		e[i] = htmlExample3;
		setter.setHTMLLines(e.slice());
	}
	const tEnd = getTime();
	return tEnd - tStart;
}

function simulatedLineRemovalMiddle(setter) {
	const e = createInitialState();
	const tStart = getTime();
	while (e.length > 0) {
		const indexToRemove = Math.floor(e.length / 2);
		e.splice(indexToRemove, 1);
		setter.setHTMLLines(e.slice());
	}	
	const tEnd = getTime();
	return tEnd - tStart;
}

function simulatedLineRemovalStart(setter) {
	const e = createInitialState();
	const tStart = getTime();
	while (e.length > 0) {
		e.shift(); // remove first.
		setter.setHTMLLines(e.slice());
	}	
	const tEnd = getTime();
	return tEnd - tStart;
}

function simulatedLineRemovalEnd(setter) {
	const e = createInitialState();
	const tStart = getTime();
	while (e.length > 0) {
		e.pop();
		setter.setHTMLLines(e.slice());
	}	
	const tEnd = getTime();
	return tEnd - tStart;
}

export function setHTMLBenchmark(setter) {
	return {
		'simulatedTyping': simulatedTyping(setter),
		'simulatedLineRemovalStart': simulatedLineRemovalStart(setter),
		'simulatedLineRemovalMiddle': simulatedLineRemovalMiddle(setter),
		'simulatedLineRemovalEnd': simulatedLineRemovalEnd(setter)
	};
};