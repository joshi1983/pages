package org.aiupscaling;

public class GrayGetter implements ValueGetter {
	public int get(byte[] pixelBytes, int width, int x, int y) {
		int index = (x + y * width) * 3;
		int r = Byte.toUnsignedInt(pixelBytes[index]);
		int g = Byte.toUnsignedInt(pixelBytes[index + 1]);
		int b = Byte.toUnsignedInt(pixelBytes[index + 2]);
		return (int)((r + g + b) * 0.3333333);
	}
}
