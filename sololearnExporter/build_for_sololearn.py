"""
This is for converting a more clearly structured 
set of source files into the format used by Sololearn.
"""

import os
import os.path
from lxml import html
from shutil import copyfile
import sys


def is_removable_element(e):
	url = ''
	if e.tag == 'script':
		url = e.attrib['src']
	elif e.tag == 'link':
		url = e.attrib['href']
	if url.startswith('https:') or url.startswith('http:') or url.startswith('//'):
		return False
	if is_substitutable_external_script(e):
		return False

	return True


def is_substitutable_external_script(e):
	if e.tag != 'script' or 'type' not in e.attrib or 'src' not in e.attrib:
		return False

	return 'glsl' in e.attrib['type']


def merge_javascript(folder):
	with open(folder + '/index.html', 'r') as f:
		html_content = f.read()
	
	doc = html.fromstring(html_content)
	
	scripts = doc.cssselect('script[src]')
	s = ''
	for e in scripts:
		src = e.get('src')
		if is_substitutable_external_script(e):
			e.attrib.pop('src')
			source = ''
			if 'https:' not in src and 'http:' not in src:
				src = folder + '/' + src
			with open(src, 'r') as f:
				source += f.read()
			source = "// <![CDATA[\n" + source + "// ]]>\n"
			src.text = source
		else:
			if 'https:' not in src and 'http:' not in src:
				src = folder + '/' + src
				with open(src, 'r') as f:
					s += f.read() + "\n\n"

	with open('sololearn/script.js', 'w') as f:
		f.write(s + "\n")

	# remove all script and link elements.
	elements_to_remove = doc.cssselect('script[src],link[rel="stylesheet"][href]')
	for e in elements_to_remove:
		if is_removable_element(e):
			e.getparent().remove(e)

	with open('sololearn/index.html', 'w') as f:
		f.write(html.tostring(doc, with_tail=False).decode('utf-8'))


def export(folder):
	out_directory = 'sololearn'
	if not os.path.exists(out_directory):
		os.mkdir(out_directory)

	copyfile(folder + '/style.css', out_directory + '/style.css')
	merge_javascript(folder)

# if there are too few arguments, say so.
if len(sys.argv) <= 1:
	print('You must specify a folder like python build_for_sololearn.py volumetricFractal')
else:
	folder_name = sys.argv[1]
	if '/' not in folder_name:
		folder_name = '../' + folder_name
	if os.path.exists(folder_name) == False:
		print('folder does not exist: ' + folder_name)
	elif os.path.isfile(folder_name) == True:
		print('folder argument must be a directory and not a file: ' + folder_name)
	else:
		export(folder_name)
		print('folder_name = ' + folder_name)
