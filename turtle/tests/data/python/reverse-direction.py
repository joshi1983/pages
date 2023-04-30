# copied from:
# https://www.pinterest.ca/pin/97812623137607059/

import turtle
import random

window = turtle.Screen()
arthur = turtle.Turtle()
window.colormode(255)
arthur.speed(0)
arthur.width(2)
window.bgcolor(50, 0, 70)
arthur.pencolor(255, 255, 0)

def shape(angle, side, limit):
	reverseDirection = 200
	arthur.forward(side)
	if side % (reverseDirection * 2) == 0:
		angle = angle + 2
		print side
	elif side % reverseDirection == 0:
		angle = angle - 2
		print side
	arthur.right(angle)
	side = side + 2
	if side < limit:
		shape(angle, side, limit)

angle 119
side = 0
limit - 600
shape(angle, side, limit)

turtle.done()