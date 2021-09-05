# copied from:
# https://www.youtube.com/shorts/O1r2W3fNKtE
from turtle import *
import colorsys as cs

tracer(5)
bgcolor('black')
starx = -(25*20) / 2
stary = (25 * 20) / 2

for row in range(25):
	for col in range(25):
		x = starx + col * 20
		y = stary + row * 20
		penup()
		goto(x, y)
		pendown()
		h = (row + col) / (25 + 25)
		color(cs.hsv_to_rgb(h, 0.9, 0.9))
		begin_fill()
		for _ in range(4):
			forward(20)
			right(90)
		end_fill()
done()