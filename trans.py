import os
import csv
import ijson
import json
import mysql.connector
import datetime

cnxn = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
added = 0
deleted = 0
error = 0
firstLine = True
with open('Sales-160.csv') as csvDataFile:
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
                if o[5] == 'Return':
                    cursor.execute("DELETE FROM Sales WHERE id='" + str(o[2]) + "' ")
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
            