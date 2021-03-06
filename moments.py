import os
import ijson
import json
from datetime import datetime,timezone
import requests
from dateutil.relativedelta import relativedelta
from time import sleep
import mysql.connector
import sys

dbName = sys.argv[1]

cnxn = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database=dbName)
dddd = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database=dbName)
added = 0
error = 0
now = datetime.now(timezone.utc)

d = dddd.cursor()
d.execute("DELETE FROM Moments")
dddd.commit()

#url = 'http://44.192.77.149/AP/V1/GroupedPOSBypass?endDate=' + requests.utils.quote(str(now.replace(tzinfo=timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')))+ '&size=20000'
url = 'http://3.235.171.79/AP/V1/GroupedPOSBypass?size=50000'
headers = {'Authorization': 'APIKEY 2993A070-1E86-4967-8C93-D592602EDD30', 'Accept': 'application/json' , 'Content-Type': 'application/json'}
response = requests.request("GET", url, headers=headers)
print("Got data")
jsonResponse = response.json()
for o in jsonResponse['content']:
    ts = o['lastMoment'].replace('T', ' ')
    ts = ts.replace('Z', '')
    tsD = ts.split('.')
    now = str(tsD[0])
    storeId = ''
    momentId = o['id']
    for ml in o['momentList']:
        storeId = ml['site']
        itemId = ml['itemId'].replace(':', '')
        momentId = ml['id']
        productId = ml['product']['productId']
        originRegionId = ml['originRegion']['id']
        regionId = ml['region']['id']
        try:
            cursor = cnxn.cursor()
            cursor.execute("INSERT INTO Moments (id, storeId, itemId, productId, originRegionId, regionId, ts) VALUES (%s, %s, %s, %s, %s, %s, %s)", (momentId, storeId, itemId, productId, originRegionId, regionId, ts))
            cnxn.commit()
            added = added + 1
        except Exception as e:
            print(str(e))
            errpr = error + 1
        print("Added: " + str(added) + ", Errors: " + str(error))


d.execute("UPDATE Moments m INNER JOIN Sales s ON m.itemId=s.id AND m.storeId=s.storeId SET m.isFlag=1")
dddd.commit() 
d.execute("DELETE FROM Moments WHERE isFlag=1")
dddd.commit() 
d.execute("DELETE FROM EpcMoments")
dddd.commit() 
d.execute("INSERT INTO EpcMoments (id, productId, storeId, styleName, yyyy, mm, dd) SELECT m.itemId, m.productId, m.storeId, p.styleName, YEAR(m.ts), MONTH(m.ts), DAY(m.ts) FROM Moments m JOIN Products p ON m.productId=p.sku WHERE m.isFlag=0")
dddd.commit() 