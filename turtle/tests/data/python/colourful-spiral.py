# copied from: https://qr.ae/pAq2EV
# https://www.quora.com/Whats-the-coolest-Python-turtle-graphic-you-have-seen?topAns=64192292
# It was shared in an answer by a Quora user calling himself Devendra Kushwah.
from turtle import * 
from random import randint 
bgcolor('black') 
x = 1 
speed(0) 
while x < 400: 
  
 r = randint(0,255) 
 g = randint(0,255)  
 b = randint(0,255) 
  
 colormode(255)  
 pencolor(r,g,b) 
 fd(50 + x) 
 rt(90.991) 
 x = x+1 
  
exitonclick() 