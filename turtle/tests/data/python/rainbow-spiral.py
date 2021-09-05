# copied from a youtube video:
# https://www.youtube.com/shorts/FLNAdSMfbPM

from turtle import *
import colorsys

bgcolor('black')
speed(0)
pensize(2)

hue = 0.0

for i in range(300):
	color =colorsys.hsv_to_rgb(hue, 1, 1)
	pencolor(color)
	hue += 0.005
	right(i)
	circle(50,i)
	forward(i)
	left(91)
	