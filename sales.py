import os
import csv
import ijson
import json
import mysql.connector
import datetime
import pyodbc

cnxn = pyodbc.connect(r'Driver=SQL Server;Server=DESKTOP-BKLRQLD\MSSQLSERVER01;Database=LuluTest;Trusted_Connection=yes;')
cccc = pyodbc.connect(r'Driver=SQL Server;Server=DESKTOP-BKLRQLD\MSSQLSERVER01;Database=LuluTest;Trusted_Connection=yes;')
dddd = pyodbc.connect(r'Driver=SQL Server;Server=DESKTOP-BKLRQLD\MSSQLSERVER01;Database=LuluTest;Trusted_Connection=yes;')
eeee = pyodbc.connect(r'Driver=SQL Server;Server=DESKTOP-BKLRQLD\MSSQLSERVER01;Database=LuluTest;Trusted_Connection=yes;')


'''
cnxn = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
cccc = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
dddd = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
eeee = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
'''
print("Cleaning existing sales")
c = cccc.cursor()
c.execute("DELETE FROM Sales")
cccc.commit()
#c.execute("UPDATE EpcMovement SET soldTimestamp=NULL, isSold=0")
#cccc.commit()
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
            try:
                cursor = cnxn.cursor()
                if o[5] == 'RETURN':
                    cursor.execute("DELETE FROM Sales WHERE id='" + str(o[1]) + "' ")
                    deleted = deleted + 1
                    cnxn.commit()
                else:
                    cursor.execute("INSERT INTO Sales (id, productId, soldTimestamp, transactionType, storeId) VALUES ('"+o[2]+"', '" + o[3] + "', '" + o[4] + "', '" + o[5] + "', '1597647a-7056-3fe9-94c1-ae5c9d16d69b')")
                    added = added + 1
                    cnxn.commit()
            except Exception as e:
                print(str(e))
                errpr = error + 1
            print("Added: " + str(added) + ", Deleted: " + str(deleted) + ", Errors: " + str(error))
