import turtle

def shape(angle, side, limit):
	print("hi")
	if side < limit:
		shape(angle, side, limit - 1)


shape(119, 0, 600)