from datetime import datetime,timezone
import requests
from dateutil.relativedelta import relativedelta
from time import sleep
import mysql.connector
cnxn = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
cccc = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
dddd = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
eeee = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
added = 0
errors = 0

try:
    d3 = dddd.cursor()
    d3.execute("SELECT id, productId, storeId, regionId, ts, x, y, confidence FROM EpcMovement ORDER BY id, ts;")
    lastX = 0
    lastY = 0
    lastId = ''
    myresult = d3.fetchall()
    for r in myresult:
        storeId = r[2]
        productId = o[1]
        i = o[0]
        regionId = o[3]
        ts = o[4]
        x = o[5]
        y = o[6]
        confidence = o[7]
        try:
            cn = cnxn.cursor()
            cn.execute("INSERT INTO EpcMoveCombined (id, productId, storeId, regionId, ts, x, y, confidence, lastX, lastY) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (i, productId, storeId, regionId, ts, x, y, confidence, lastX, lastY))
            cnxn.commit()
            added = added + 1
            if lastId == i:
                lastX = x
                lastY = y
            else:
                lastId = i
                lastX = 0
                lastY = 0
        except Exception as e:
            print(str(e))
            errors = errors + 1
        print("Added: " + str(added) + ", Errors: " + str(errors))
except Exception as e:
    print(str(e))
        