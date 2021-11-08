import os
import csv
import ijson
import json
import mysql.connector
import datetime

cnxn = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
added = 0
deleted = 0

with open('itemdata.csv') as csvDataFile:
    csvReader = csv.reader(csvDataFile)
    for o in csvReader:
        try:
            cursor = cnxn.cursor()
            cursor.execute("INSERT INTO TestProducts (sku, deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName, styleCode, styleName, price, store, total) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (o[0], o[2], o[6], o[3], o[8], o[4], o[10], o[5], o[12], o[1], o[14], float(o[15]), o[16], int(o[17])) )
            cnxn.commit()
            added = added + 1
        except Exception as e:
            print(str(e))
            deleted = deleted + 1
        print("Added: " + str(added) + ", Errors: " + str(deleted))
            