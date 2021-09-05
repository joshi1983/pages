# Copied from https://www.youtube.com/watch?v=-yV25P5pstg
# Written by Robaidul Islam
import math
from turtle import *

def calculateY(k):
	return 12*math.cos(k) - 5*math.cos(2*k) - 2*math.cos(3*k) - math.cos(4*k)

def calculateX(k):
	return 15*math.sin(k)**3

speed(0)
bgcolor("black")

for i in range(10000):
	x = calculateX(i)*20
	y = calculateY(i)*20

	goto(x, y)
	color("#f73487")
	
	goto(0, 0)

done()
					