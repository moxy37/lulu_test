import os
import math
import sys
import statistics
import mysql.connector

kSize = int(sys.argv[1])
isDeleted = int(sys.argv[2])
dbName = sys.argv[3]
aaaa = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database=dbName)
bbbb = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database=dbName)

print("Starting loading basics")
a2 = aaaa.cursor()
a2.execute("SELECT id, storeName FROM Stores")
myStores = a2.fetchall()
stores = {}
for s in myStores:
    stores[s[0]] = s[1]
a4 = aaaa.cursor()
a4.execute("SELECT productId, xCenter, yCenter FROM Zones WHERE k="+str(kSize)+" AND isHome=1")
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
'''
print("Creating last update table")
a6 = aaaa.cursor()
a6.execute("DROP TABLE IF EXISTS LastUpdateTS")
aaaa.commit()
a7 = aaaa.cursor()
a7.execute("CREATE TABLE LastUpdateTS (id VARCHAR(40), ts DATETIME, x FLOAT DEFAULT 0, y FLOAT DEFAULT 0, regionId VARCHAR(40))")
aaaa.commit()
a8 = aaaa.cursor()
a8.execute("INSERT INTO LastUpdateTS (id, ts) SELECT id, MAX(ts) AS ts FROM EpcMovement WHERE isUpdated=1 GROUP BY id")
aaaa.commit()
a9 = aaaa.cursor()
a9.execute("UPDATE LastUpdateTS t1 INNER JOIN EpcMovement t2 ON t1.id=t2.id AND t1.ts=t2.ts SET t1.regionId=t2.regionId, t1.x=t2.x, t1.y=t2.y")
aaaa.commit()
a10 = aaaa.cursor()
a10.execute("SELECT id, x, y, ts, regionId FROM LastUpdateTS")
myLastUpdate = a10.fetchall()
'''
lastUpdate = {}
'''
for l in myLastUpdate:
    ll = {}
    ll['x'] = l[1]
    ll['y'] = l[2]
    ll['ts'] = l[3]
    ll['regionId'] = l[4]
    lastUpdate[l[0]] = ll
'''
print("Getting all movement datat to update")
c4 = aaaa.cursor()
sql = "SELECT id, x, y, ts, storeId, regionId, productId FROM EpcMovement WHERE isUpdated=0 AND isDeleted=0 AND dailyMoves < 40 ORDER BY id, ts"
if isDeleted == 1:
    sql = "SELECT id, x, y, ts, storeId, regionId, productId FROM EpcMovement WHERE isUpdated=0 AND dailyMoves < 40 ORDER BY id, ts"
elif isDeleted == 2:
    sql = "SELECT id, x, y, ts, storeId, regionId, productId FROM EpcMovement WHERE dailyMoves < 40 ORDER BY id, ts"
c4.execute(sql)
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
        if lastId in lastUpdate:
            lastX = lastUpdate[lastId]['x']
            lastY = lastUpdate[lastId]['y']
            try:
                dLast = math.sqrt((lastX - x)*(lastX - x) + (lastY - y)*(lastY - y))
                sql = "UPDATE EpcMovement SET dHome=%s, lastX=%s, lastY=%s, dLast=%s, isUpdated=1, soldTimestamp=%s, isSold=%s, storeName=%s WHERE id=%s AND storeId=%s AND regionId=%s AND ts=%s"
                vals = (dHome, lastX, lastY, dLast, soldTimestamp, isSold, storeName, o[0], o[4], o[5], o[3])
                b4 = bbbb.cursor()
                b4.execute(sql, vals)
                bbbb.commit()
                lastX = o[1]
                lastY = o[2]
                updated = updated + 1
            except Exception as e:
                errors = errors + 1
        else:
            lastX = o[1]
            lastY = o[2]
        
            try:
                
                sql = "UPDATE EpcMovement SET isUpdated=1, dHome=%s, soldTimestamp=%s, isSold=%s, storeName=%s WHERE id=%s AND storeId=%s AND regionId=%s AND ts=%s"
                vals = (dHome, soldTimestamp, isSold, storeName, o[0], o[4], o[5], o[3])
                b4 = bbbb.cursor()
                b4.execute(sql, vals)
                bbbb.commit()
                skipped = skipped + 1
            except Exception as e:
                errors = errors + 1
    else:
        
        try:

            dLast = math.sqrt((lastX - x)*(lastX - x) + (lastY - y)*(lastY - y))
            sql = "UPDATE EpcMovement SET dHome=%s, lastX=%s, lastY=%s, dLast=%s, isUpdated=1, soldTimestamp=%s, isSold=%s, storeName=%s WHERE id=%s AND storeId=%s AND regionId=%s AND ts=%s"
            vals = (dHome, lastX, lastY, dLast, soldTimestamp, isSold, storeName, o[0], o[4], o[5], o[3])
            b4 = bbbb.cursor()
            b4.execute(sql, vals)
            bbbb.commit()
            lastX = o[1]
            lastY = o[2]
            updated = updated + 1
        except Exception as e:
            errors = errors + 1
    print("Updated: " + str(updated) + ", Skipped: " + str(skipped) + ", Errors: " + str(errors) + " of total: " + str(total))
            
