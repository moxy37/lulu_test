import os
import math
import sys
import statistics
import mysql.connector

aaaa = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
bbbb = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
a4 = aaaa.cursor()
a4.execute("SELECT productId, xCenter, yCenter FROM Zones WHERE k=2 AND isHome=1")
myZones = a4.fetchall()
zones = {}
for z in myZones:
    zz = {}
    zz['x'] = z[1]
    zz['y'] = z[2]
    zones[z[0]]= zz

print("Getting all")
c4 = aaaa.cursor()
c4.execute("SELECT id, x, y, ts, storeId, regionId, productId FROM EpcMovement WHERE isUpdated=0 ORDER BY id, ts")
myRes = c4.fetchall()
print("Got them")
total = len(myRes)
updated = 0
errors = 0
skipped = 0
lastId = ''
lastX = 0
lastY = 0
for o in myRes:
    productId = o[6]
    x = o[1]
    y = o[2]
    dHome = 0
    if productId in zones:
        dHome = math.sqrt((zones[productId]['x'] - x)*(zones[productId]['x'] - x) + (zones[productId]['y'] - y)*(zones[productId]['y'] - y))
    if lastId != o[0]:
        lastId = o[0]
        lastX = o[1]
        lastY = o[2]
        
        try:
            
            sql = "UPDATE EpcMovement SET isUpdated=1, dHome=%s WHERE id=%s AND storeId=%s AND regionId=%s AND ts=%s"
            vals = (dHome, o[0], o[4], o[5], o[3])
            b4 = bbbb.cursor()
            b4.execute(sql, vals)
            bbbb.commit()
            skipped = skipped + 1
        except Exception as e:
            errors = errors + 1
    else:
        
        try:

            dLast = math.sqrt((lastX - x)*(lastX - x) + (lastY - y)*(lastY - y))
            sql = "UPDATE EpcMovement SET dHome=%s, lastX=%s, lastY=%s, dLast=%s, isUpdated=1 WHERE id=%s AND storeId=%s AND regionId=%s AND ts=%s"
            vals = (dHome, lastX, lastY, dLast, o[0], o[4], o[5], o[3])
            b4 = bbbb.cursor()
            b4.execute(sql, vals)
            bbbb.commit()
            lastX = o[1]
            lastY = o[2]
            updated = updated + 1
        except Exception as e:
            errors = errors + 1
    print("Updated: " + str(updated) + ", Skipped: " + str(skipped) + ", Errors: " + str(errors) + " of total: " + str(total))
            
