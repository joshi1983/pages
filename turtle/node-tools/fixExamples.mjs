/*
Runs a headless browser to fix all examples and save them.
To DO: 
- get a headless browser to open WebLogo.
- compute some simple result from WebLogo.
- save calculated result to file.
- compute a fixed version of a Logo program.
- save that.
- loop through all .lgo examples in logo-scripts directory and save all fixed files that can be fixed.
*/
import { autoFix } from './puppeteer-helpers/autoFix.mjs';
import { harmonizeCase } from './puppeteer-helpers/harmonizeCase.mjs';
import { loadExample } from './puppeteer-helpers/loadExample.mjs';
import { openCodeEditor } from './puppeteer-helpers/openCodeEditor.mjs';
import puppeteer from 'puppeteer';
import { readExamples } from './puppeteer-helpers/readExamples.mjs';
import { saveCodeToFile } from './puppeteer-helpers/saveCodeToFile.mjs';
import { sleep } from './puppeteer-helpers/sleep.mjs';

const browser = await puppeteer.launch({
		'headless': false,
		'args': ['--user-agent=fixExamples'],
		'executablePath': 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
	});
try {
	const examples = await readExamples();
	const page = await browser.newPage();
	const url = 'http://localhost:9001/turtle';
	await page.goto(url);
	await openCodeEditor(page);
	for (let i = 0; i < examples.length; i++) {
		const exampleInfo = examples[i];
		await loadExample(page, exampleInfo.filename);
		await autoFix(page);
		await harmonizeCase(page);
		await saveCodeToFile(page, exampleInfo.filename);
		await sleep(100);
	}
	//await page.screenshot({ path: 'turtle-screenshot.png' })
} catch (error) {
  console.log(error);
} finally {
  await browser.close();
}