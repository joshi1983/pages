console.log('console log from dynamicImportWorker test code');

addEventListener('message', function(input) {
	const modulePaths = input.data;
	for (const path of modulePaths) {
		console.log(`About to import path ${path}`);
		import(path).then(function(module) {
			console.log(`module = ${JSON.stringify(typeof module)}`);
		});
		console.log(`Done import path ${path}`);
	}
	
	self.postMessage('Hello world');
});