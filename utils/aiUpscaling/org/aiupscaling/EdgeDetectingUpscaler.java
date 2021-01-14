package org.aiupscaling;

import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.awt.Point;
import java.awt.Color;
import java.awt.Graphics;
import java.util.ArrayList;

public class EdgeDetectingUpscaler implements Upscaler {
	private static int[][] horizontalContrastMatrix = new int[][] {
		new int[] {-1, -2, 2, 1},
		new int[] {-2, -4, 4, 2},
		new int[] {-2, -4, 4, 2},
		new int[] {-1, -2, 2, 1},
	};
	private static int[][] verticalContrastMatrix = new int[][] {
		new int[] {-1, -2, -2, -1},
		new int[] {-2, -4, -4, -2},
		new int[] {2, 4, 4, 2},
		new int[] {1, 2, 2, 1}
	};

	private static int[][] horizontalContrastMatrix2 = new int[][] {
		new int[] {-1, -2, 1},
		new int[] {0, 0, 0},
		new int[] {1, 2, 1}
	};
	private static int[][] verticalContrastMatrix2 = new int[][] {
		new int[] {-1, 0, 1},
		new int[] {-2, 0, 2},
		new int[] {-1, 0, 1}
	};

	private static class EdgeResult {
		public double angle;
		public double contrastRatio;
		
		public EdgeResult(double angle, double contrastRatio) {
			this.angle = angle;
			this.contrastRatio = contrastRatio;
		}
	}

	private static class GrayGetter implements ValueGetter {
		public int get(byte[] pixelBytes, int width, int x, int y) {
			int index = (x + y * width) * 3;
			int r = Byte.toUnsignedInt(pixelBytes[index]);
			int g = Byte.toUnsignedInt(pixelBytes[index + 1]);
			int b = Byte.toUnsignedInt(pixelBytes[index + 2]);
			return (int)((r + g + b) * 0.3333333);
		}
	}

	private static EdgeResult getEdgeAngle(byte[] pixelData, int width, int x, int y, ValueGetter getter) {
		double xContrast = 0;
		double yContrast = 0;
		for (int dx = -2; dx < 2; dx++) {
			for (int dy = -2; dy < 2; dy++) {
				int coefficient = horizontalContrastMatrix[dx + 2][dy + 2];
				xContrast += coefficient * getter.get(pixelData, width, x + dx * 2, y + dy * 2);
			}
		}
		for (int dx = -2; dx < 2; dx++) {
			for (int dy = -2; dy < 2; dy++) {
				int coefficient = verticalContrastMatrix[dx + 2][dy + 2];
				yContrast += coefficient * getter.get(pixelData, width, x + dx * 2, y + dy * 2);
			}
		}
		// use xContrast and yContrast to calculate angle.
		double angle = Math.atan2(-yContrast, xContrast);
		return new EdgeResult(angle, Math.abs(yContrast) + Math.abs(xContrast));
	}

	private static EdgeResult getEdgeAngle2(byte[] pixelData, int width, int x, int y, ValueGetter getter) {
		double xContrast = 0;
		double yContrast = 0;
		for (int dx = -1; dx < 2; dx++) {
			for (int dy = -1; dy < 2; dy++) {
				int coefficient = horizontalContrastMatrix2[dx + 1][dy + 1];
				xContrast += coefficient * getter.get(pixelData, width, x + dx, y + dy);
			}
		}
		for (int dx = -1; dx < 2; dx++) {
			for (int dy = -1; dy < 2; dy++) {
				int coefficient = verticalContrastMatrix2[dx + 1][dy + 1];
				yContrast += coefficient * getter.get(pixelData, width, x + dx, y + dy);
			}
		}
		// use xContrast and yContrast to calculate angle.
		double angle = Math.atan2(-yContrast, xContrast);
		return new EdgeResult(angle, Math.abs(yContrast) + Math.abs(xContrast));
	}
	
	private static double getVariance(ArrayList<Double> numbers) {
		double total = 0;
		for (Double d: numbers) {
			total += d;
		}
		double average = total/numbers.size();
		double result = 0;

		for (Double d: numbers) {
			result += Math.abs(d - average);
		}

		return result;
	}

	private static EdgeResult getEdgeAngle3(byte[] pixelData, int width, int x, int y, ValueGetter getter) {
		int maxRadius = 5;
		double minVariance = Double.MAX_VALUE;
		double angleWithMinVariance = 0;
		for (int i = 0; i < 20; i++) {
			double angle = i * Math.PI / 20;
			double sinA = Math.sin(angle);
			double cosA = Math.cos(angle);
			ArrayList<Double> numbers = new ArrayList<Double>();

			for (int r = 1; r <= maxRadius; r++) {
				int px = (int)Math.round(x + r * cosA);
				int py = (int)Math.round(y + r * sinA);
				int v = getter.get(pixelData, width, px, py);
				numbers.add((double)v);
				
				px = (int)Math.round(x - r * cosA);
				py = (int)Math.round(y - r * sinA);
				v = getter.get(pixelData, width, px, py);
				numbers.add((double)v);
			}
			double variance = getVariance(numbers);
			if (variance < minVariance) {
				angleWithMinVariance = angle;
				minVariance = variance;
			}
		}
		
		return new EdgeResult(angleWithMinVariance, 1);
	}

	private static int getValueFromRotatedEdge(byte[] pixels, 
		int width, double angle, double x, double y, ValueGetter getter) {
		double sinAngle = Math.sin(angle);
		double cosAngle = Math.cos(angle);
		double result = 0;
		double coefficientSum = 0;
		for (double m = -2; m <= 2; m += 0.1) {
			int px = (int)(x + cosAngle * m);
			int py = (int)(y + sinAngle * m);
			int v = getter.get(pixels, width, px, py);
			double coefficient = 1;
			if (Math.abs(m) < 1) {
				coefficient = Math.abs(m);
			}
			else if (Math.abs(m) > 2) {
				coefficient = 2 - Math.abs(m);
			}
			coefficientSum += coefficient;
			result += coefficient * v;
		}

		return (int)Math.max(0, Math.min(255, result / coefficientSum));
	}

	private static void getValueFromEdge(byte[] pixels, int[] results, int width, int x, int y, ValueGetter getter) {
		EdgeResult edgeResult = getEdgeAngle3(pixels, width, x, y, getter);
		double angle = edgeResult.angle;
		double dx = x + 0.5, dy = y + 0.5; 
		results[0] = getValueFromRotatedEdge(pixels, width, angle, dx + 0.5, dy, getter);
		results[1] = getValueFromRotatedEdge(pixels, width, angle, dx, dy + 0.5, getter);
		results[2] = getValueFromRotatedEdge(pixels, width, angle, dx + 0.5, dy + 0.5, getter);
	}

	private void copyPixel(byte[] smallPixels, byte[] resultPixels, int smallWidth, int x, int y) {
		int smallIndex = (x + y * smallWidth) * 3;
		int resultIndex = ((x + (y << 1) * smallWidth) << 1) * 3;
		resultPixels[resultIndex] = smallPixels[smallIndex];
		resultPixels[resultIndex + 1] = smallPixels[smallIndex + 1];
		resultPixels[resultIndex + 2] = smallPixels[smallIndex + 2];
	}

	public static BufferedImage drawEdgeVectorImage(BufferedImage smallImage) {
		BufferedImage result = new BufferedImage(smallImage.getWidth() * 2, smallImage.getHeight() * 2, BufferedImage.TYPE_3BYTE_BGR);
		byte[] smallPixels = ((DataBufferByte) smallImage.getRaster().getDataBuffer()).getData();
		ValueGetter gray = new GrayGetter();
		Graphics g = result.getGraphics();
		g.setColor(Color.WHITE);
		
		for (int x = 6; x < smallImage.getWidth() - 6; x+= 4) {
			for (int y = 6; y < smallImage.getHeight() - 6; y+= 4) {
				EdgeResult edgeResult = getEdgeAngle(smallPixels, smallImage.getWidth(), x, y, gray);
				if (edgeResult.contrastRatio > 0.5) {
					double angle = edgeResult.angle;
					int x2 = (int)(x * 2 + 5 * Math.cos(angle));
					int y2 = (int)(y * 2 + 5 * Math.sin(angle));
					// draw line.
					g.drawLine(x * 2, y * 2, x2, y2);
				}
			}
		}
		
		return result;
	}
	
	public BufferedImage upscale(BufferedImage smallImage) {
		BufferedImage result = new BufferedImage(smallImage.getWidth() * 2, smallImage.getHeight() * 2, BufferedImage.TYPE_3BYTE_BGR);
		// get the pixel data.
		byte[] smallPixels = ((DataBufferByte) smallImage.getRaster().getDataBuffer()).getData();
		byte[] resultPixels = ((DataBufferByte) result.getRaster().getDataBuffer()).getData();
		int[] redResults = new int[3];
		int[] greenResults = new int[3];
		int[] blueResults = new int[3];
		Point[] offsets = new Point[] {
			new Point(1, 0),
			new Point(0, 1),
			new Point(1, 1)
		};
		int blendMargin = 6;
		ValueGetter red = new RedGetter();
		ValueGetter green = new GreenGetter();
		ValueGetter blue = new BlueGetter();

		for (int x = 0; x < smallImage.getWidth(); x++) {
			for (int y = 0; y < smallImage.getHeight(); y++) {
				if (x < blendMargin || y < blendMargin || x > smallImage.getWidth() - blendMargin - 1 || y > smallImage.getHeight() - blendMargin - 1)
					NeighbourBlendUpscaler.blendPixel(smallPixels, resultPixels, smallImage.getWidth(), smallImage.getHeight(), x, y);
				else {
					copyPixel(smallPixels, resultPixels, smallImage.getWidth(), x, y);
					NeighbourBlendUpscaler.blendPixel(smallPixels, resultPixels, smallImage.getWidth(), smallImage.getHeight(), x, y);
					// detect edge direction.
					// blend the pixels accordingly.
					getValueFromEdge(smallPixels, redResults, smallImage.getWidth(), x, y, red);
					getValueFromEdge(smallPixels, greenResults, smallImage.getWidth(), x, y, green);
					getValueFromEdge(smallPixels, blueResults, smallImage.getWidth(), x, y, blue);
					for (int i = 0; i < 3; i++) {
						int index = ((((x << 1) + offsets[i].x) + ((y << 1) + offsets[i].y) * result.getWidth())) * 3;
						if (index >= resultPixels.length) {
							System.out.println("index = " + index + ", x = " + x + ", y = " + y + ", i = " + i);
						}
						resultPixels[index] = (byte)(Byte.toUnsignedInt(resultPixels[index]) * 0.5 + redResults[i] * 0.5);
						resultPixels[index + 1] = (byte)(Byte.toUnsignedInt(resultPixels[index + 1]) * 0.5 + greenResults[i] * 0.5);
						resultPixels[index + 2] = (byte)(Byte.toUnsignedInt(resultPixels[index + 2]) * 0.5 + blueResults[i] * 0.5);
					}
				}
			}
		}
		
		return result;
	}
}