import os
import math
import sys
import statistics
import mysql.connector

aaaa = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
bbbb = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
a2 = aaaa.cursor()
a2.execute("SELECT id, storeName FROM Stores")
myStores = a2.fetchall()
stores = {}
for s in myStores:
    stores[s[0]] = s[1]
a3 = aaaa.cursor()
a3.execute("SELECT id, regionName FROM Regions")
myRegions = a3.fetchall()
regions = {}
for r in myRegions:
    regions[r[0]] = r[1]
a4 = aaaa.cursor()
a4.execute("SELECT productId, xCenter, yCenter FROM Zones WHERE k=3 AND isHome=1")
myZones = a4.fetchall()
zones = {}
for z in myZones:
    zz = {}
    zz['x'] = z[1]
    zz['y'] = z[2]
    zones[z[0]]= zz
a5 = aaaa.cursor()
a5.execute("SELECT id, productId, DATE_ADD(soldTimestamp, iNTERVAL -4 HOUR), storeId FROM Sales")
mySales = a5.fetchall()
sales = {}
for s in mySales:
    if s[3] not in sales:
        sales[s[3]] = {}
    sales[s[3]][s[0]] = s[2]
print("Getting all")
c4 = aaaa.cursor()
c4.execute("SELECT id, x, y, ts, storeId, regionId, productId FROM EpcMovement_Test WHERE isUpdated=0 ORDER BY id, ts")
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
    storeId = o[4]
    regionId = o[5]
    storeName = stores[storeId]
    regionName = ''
    ts = o[3]
    soldTimestamp = None
    isSold = 0
    if storeId in sales:
        if o[0] in sales[storeId]:
            soldTimestamp = sales[storeId][o[0]]
            if ts > soldTimestamp:
                isSold = 1
    if productId in zones:
        dHome = math.sqrt((zones[productId]['x'] - x)*(zones[productId]['x'] - x) + (zones[productId]['y'] - y)*(zones[productId]['y'] - y))
    if lastId != o[0]:
        lastId = o[0]
        lastX = o[1]
        lastY = o[2]
        
        try:
            
            sql = "UPDATE EpcMovement_Test SET isUpdated=1, dHome=%s, soldTimestamp=%s, isSold=%s, storeName=%s, regionName=%s WHERE id=%s AND storeId=%s AND regionId=%s AND ts=%s"
            vals = (dHome, soldTimestamp, isSold, storeName, regionName, o[0], o[4], o[5], o[3])
            b4 = bbbb.cursor()
            b4.execute(sql, vals)
            bbbb.commit()
            skipped = skipped + 1
        except Exception as e:
            errors = errors + 1
    else:
        
        try:

            dLast = math.sqrt((lastX - x)*(lastX - x) + (lastY - y)*(lastY - y))
            sql = "UPDATE EpcMovement SET dHome=%s, lastX=%s, lastY=%s, dLast=%s, isUpdated=1, soldTimestamp=%s, isSold=%s, storeName=%s, regionName=%s WHERE id=%s AND storeId=%s AND regionId=%s AND ts=%s"
            vals = (dHome, lastX, lastY, dLast, soldTimestamp, isSold, storeName, regionName, o[0], o[4], o[5], o[3])
            b4 = bbbb.cursor()
            b4.execute(sql, vals)
            bbbb.commit()
            lastX = o[1]
            lastY = o[2]
            updated = updated + 1
        except Exception as e:
            errors = errors + 1
    print("Updated: " + str(updated) + ", Skipped: " + str(skipped) + ", Errors: " + str(errors) + " of total: " + str(total))
            
