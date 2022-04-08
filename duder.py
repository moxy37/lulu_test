from datetime import datetime,timezone
import requests
from dateutil.relativedelta import relativedelta
from time import sleep
import mysql.connector
import sys
import math
from numpy import sqrt 

dbName = 'lulu2'

added = 0
failed = 0
updated = 0
cnxn = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database=dbName)
dddd = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database=dbName)
eeee = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database=dbName)
e1 = eeee.cursor()
e1.execute("SELECT productId, xCenter, yCenter FROM Zones WHERE k-2 AND isHome=1")
myzones = e1.fetchall()
zones = {}
print("getting zones")
for z in myzones:
    zones[z[0]] = {}
    zones[z[0]]['x'] = z[1]
    zones[z[0]]['y'] = z[2]

print("Got zones now getting movements")
d3 = dddd.cursor()
d3.execute("SELECT id, productId, regionId, x, y, yyyy, mm, dd, h, m, ts FROM EpcMovement ORDER BY id, ts")
myres = d3.fetchall()
totals = len(myres)
lastX = 0
lastY = 0
lastId  = ''

for r in myres:
    dHome = 0
    dLast = 0
    productId = r[1]
    regionId = r[2]
    x = r[3]
    y = r[4]
    yyyy = r[5]
    mm = r[6]
    dd = r[7]
    h = r[8]
    m = r[9]
    if productId in zones:
        dHome = sqrt((x - zones[productId]['x'])*(x - zones[productId]['x']) + (y - zones[productId]['y'])*(y - zones[productId]['y']))
    if r[0]==lastId:
        #Means we can update the dHome, and dLast features
        dLast = sqrt((x - lastX)*(x - lastX) + (y - lastY)*(y - lastY))
    sql = "UPDATE EpcMovement SET dHome=%s, dLast=%s WHERE yyyy=%s AND mm=%s AND dd=%s AND h=%s AND m=%s AND regionId=%s AND id=%s"
    vals = (dHome, dLast, yyyy, mm, dd, h, m, regionId, r[0])
    try:
        cursor = cnxn.cursor()
        cursor.execute(sql, vals)
        cnxn.commit()
        added = added + 1
    except Exception as e:
        print(str(e))
        failed = failed + 1
    lastId = r[0]
    lastX = x
    lastY = y
    print("Added: " + str(added) + ", Failed: " + str(failed) + ", of Total: " + str(totals))