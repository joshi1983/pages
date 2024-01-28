/*
In most browsers, JSON data can be fetched like:
import commands from '../json/commands.json' assert { type: "json" };
Firefox doesn't like that, though.
Firefox expects a semicolon after the end of the URL and throws a SyntaxError.
This was tested in Firefox 92.0.1 (64-bit) on Windows 10 Home.

This module defines fetchJson so we have a technique that works as tested in Firefox, Chrome, Edge and should work in other browsers.
*/

export function fetchJson(url) {
	return fetch(url).then(function(response) {
		return response.json();
	}).catch(function(error) {
		console.error('Failed to fetchJson for URL: ' + url + '.  error = ', error);
	});
}