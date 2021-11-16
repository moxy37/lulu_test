import os
import csv
import ijson
import json
import mysql.connector
import datetime

cnxn = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
cccc = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
dddd = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
eeee = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")

print("Cleaning existing sales")
c = cccc.cursor()
c.execute("TRUNCATE TABLE Sales")
cccc.commit()
c.execute("UPDATE EpcMovement SET soldTimestamp=NULL, isSold=0")
cccc.commit()
print("Clean done")
added = 0
deleted = 0
error = 0
firstLine = True
with open('sales.csv') as csvDataFile:
    csvReader = csv.reader(csvDataFile)
    for o in csvReader:
        if firstLine:
            firstLine = False
        else:
            storeId = '1597647a-7056-3fe9-94c1-ae5c9d16d69b'
            if o[0] == 350:
                storeId = 'd4f87b6f-5199-43ac-b231-fbe6e3a8039c'
            try:
                cursor = cnxn.cursor()
                if o[5] == 'RETURN':
                    cursor.execute("DELETE FROM Sales WHERE id='" + str(o[1]) + "' AND storeId='" + str(storeId) + "' ")
                    deleted = deleted + 1
                else:
                    cursor.execute("INSERT INTO Sales (id, productId, soldTimestamp, transactionType, storeId) VALUES (%s, %s, %s, %s, %s)", (o[2], o[3], o[4], o[5], storeId))
                    added = added + 1
                cnxn.commit()
                added = added + 1
            except Exception as e:
                print(str(e))
                errpr = error + 1
            print("Added: " + str(added) + ", Deleted: " + str(deleted) + ", Errors: " + str(error))
