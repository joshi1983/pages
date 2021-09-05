The bitmap code isn't complete but is complete enough to be useful.
Here are some remaining to do items:
1. Test with 32-bit bitmaps.  Should the alpha channel represent transparency?  We should compare that with other graphics software that treats it as transparency.
If documentation says the 4th byte represents opacity but we don't find other applications treating it that way, the documentation is practically wrong.
2. Test Huffman coding.
3. Test and develop saving an ImageBitmap or canvas element to a bitmap.

The PCX code isn't complete yet but it is complete enough to be useful.
Here are some remaining to do items:
1. Test and develop for PCX files that have a 4 bit depth and 4 channels.
A question asking for test PCX files was added to:
https://www.quora.com/unanswered/Where-can-I-find-a-PCX-graphic-file-that-uses-4096-colors-with-16-levels-of-transparency-I-want-to-test-a-new-PCX-library-on-it-https-en-wikipedia-org-wiki-PCX-mentions-a-4-bit-depth-with-4-planes-case-but-I-couldnt