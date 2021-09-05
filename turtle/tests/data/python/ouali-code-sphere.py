# copied from:
# https://www.youtube.com/shorts/_KPj2xrztLY
# which was uploaded by @OualiCode

from turtle import *
import colorsys as cs

bgcolor('black')
tracer(20)
hideturtle()
speed(0)
width(1)

for l in range(30):
	r = 20 + l * 8
	p = 2 + l *2
	for i in range(p):
		h = (l / 30 + i / p) / 2
		rgb = cs.hsv_to_rgb(h, 0.9, 1)
		color(rgb)
		penup()
		goto(0, 0)
		setheading(i * (360) / p)
		pendown()
		forward(r)
		circle(10 + l, 60)
		left(120)
		circle(10 + l, 60)