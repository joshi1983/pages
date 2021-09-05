import { fetchJson } from '../../../modules/fetchJson.js';
import { ScriptExampleDisplay } from '../../../modules/file/file-load-example/ScriptExampleDisplay.js';
const examples = await fetchJson('json/scriptExamples.json');

export function testScriptExampleDisplay(logger) {
	examples.forEach(function(exampleInfo) {
		const scriptDisplay = new ScriptExampleDisplay(exampleInfo.filename, true);
		const type = typeof scriptDisplay.isReadyToRun();
		if (type !== 'boolean')
			logger('isReadyToRun expected to return boolean but got ' + type);
		scriptDisplay.parsePromise.then(function() {
			const div = scriptDisplay.div;
			const content = div.textContent;
			if (content.toLowerCase().indexOf('failed') !== -1)
				logger('Found the word failed in content for script at ' + exampleInfo.filename + ', content = ' + content);
			scriptDisplay.executer.addEventListener('exception', function(e) {
				console.error(e);
				if (e.details !== undefined && e.details.e !== undefined) {
					e = e.details.e;
					if (typeof e.message === 'string')
						e = e.message;
					else if (typeof e.stack === 'string')
						e = e.stack;
				}
				logger(`Exception raised while running part of example script(${exampleInfo.filename}).  content = ${content}.  Exception is: ${JSON.stringify(e)}`);
			});
			scriptDisplay.executer.executeInstructionsSync(100);
		}).catch(function(e) {
			logger('Failed to load code from URL: ' + exampleInfo.filename + ', error: ' + e);
		});
	});
};