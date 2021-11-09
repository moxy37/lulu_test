import os
import math
import sys
import statistics
import mysql.connector

aaaa = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
bbbb = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")

c4 = aaaa.cursor()
c4.execute("SELECT id, x, y, ts, storeId, regionId FROM EpcMovement ORDER BY id, ts")
myRes = c4.fetchall()
total = len(myRes)
updated = 0
errors = 0
skipped = 0
lastId = ''
lastX = 0
lastY = 0
for o in myRes:
    if lastId != o[0]:
        lastId = o[0]
        lastX = o[1]
        lastY = o[2]
        skipped = skipped + 1
    else:
        
        try:
            x = o[1]
            y = o[2]
            dLast = math.sqrt((lastX - x)*(lastX - x) + (lastY - y)*(lastY - y))
            sql = "UPDATE EpcMovement SET lastX=%s, lastY=%s, dLast=%s WHERE id=%s AND storeId=%s AND regionId=%s AND ts=%s"
            vals = (lastX, lastY, dLast, o[0], o[4], o[5], o[3])
            b4 = bbbb.cursor()
            b4.execute(sql, vals)
            bbbb.commit()
            lastX = o[1]
            lastY = o[2]
            updated = updated + 1
        except Exception as e:
            errors = errors + 1
    print("Updated: " + str(updated) + ", Skipped: " + str(skipped) + ", Errors: " + str(errors) + " of total: " + str(total))
            
