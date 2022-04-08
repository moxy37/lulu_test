from datetime import datetime,timezone
import requests
from dateutil.relativedelta import relativedelta
from time import sleep
import mysql.connector
import sys
import math

dbName = 'lulu2'

added = 0
failed = 0
cnxn = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database=dbName)
dddd = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database=dbName)
eeee = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database=dbName)

d3 = dddd.cursor()
d3.execute("SELECT id, yyyy, mm, dd, h, maxTS FROM TempMe WHERE allReads>20")
myres = d3.fetchall()
for r in myres:
    sql = "UPDATE EpcMovement SET isDeleted=1 WHERE yyyy=%s AND mm=%s AND dd=%s AND h=%s AND m=%s AND id=%s"
    vals = (r[1], r[2], r[3], r[4], r[5], r[0])
    try:
        cursor = cnxn.cursor()
        cursor.execute(sql, vals)
        cnxn.commit()
        added = added + 1
        sql = "UPDATE EpcMovement SET isUpdated=1 WHERE ts=%s AND id=%s"
        vals = (r[6], r[0])
        try:
            c22 = cnxn.cursor()
            c22.execute(sql, vals)
            cnxn.commit()
        except Exception as e:
            print(str(e))
            failed = failed + 1
    except Exception as e:
        print(str(e))
        failed = failed + 1
    
    print("Added: " + str(added) + ", Failed: " + str(failed))