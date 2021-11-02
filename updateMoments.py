from datetime import datetime,timezone
import requests
from dateutil.relativedelta import relativedelta
from time import sleep
import mysql.connector
cnxn = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
cccc = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
dddd = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
eeee = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
#now = datetime.now(timezone.utc)
siteId = '1597647a-7056-3fe9-94c1-ae5c9d16d69b'


error = 0
added = 0
deleted = 0
print("New query")
url = 'http://44.192.77.149/AP/V1/Moments?includeEvents=true'
#print(str(url))
headers = {'Authorization': '2993A070-1E86-4967-8C93-D592602EDD30', 'Accept': 'application/json' , 'Content-Type': 'application/json'}
response = requests.request("GET", url, headers=headers)
jsonResponse = response.json()
for o in jsonResponse['content']:
    try:
        itemId = o['itemId']
        productId = o['product']['productId']
        regionId = o['region']['id']
        originRegionId = o['originRegion']['id']
        ts = o['lastEvent'].replace('T', ' ')
        ts = ts.replace('Z', '')
        storeId = o['site']
        cursor = cnxn.cursor()
        cursor.execute("INSERT INTO Moments (id, storeId, itemId, productId, originRegionId, regionId, ts) VALUES (%s, %s, %s, %s, %s, %s, %s)", (o['id'], storeId, itemId, productId, originRegionId, regionId, ts))
        cnxn.commit()
        added = added + 1
    except Exception as e:
        print(str(e))
        errpr = error + 1
    print("Added: " + str(added) + ", Errors: " + str(error))
c2 = cccc.cursor()
c2.execute("TRUNCATE TABLE EpcMoments")
cccc.commit()
c3 = dddd.cursor()
c3.execute("INSERT INTO EpcMoments (id, productId, styleName, yyyy, mm, dd) SELECT m.itemId, m.productId, p.styleName, YEAR(m.ts), MONTH(m.ts), DAY(m.ts) FROM Moments m JOIN Products p ON m.productId=p.sku WHERE m.isFlag=0")
dddd.commit()
'''
TRUNCATE TABLE EpcMoments;
INSERT INTO EpcMoments (id, productId, styleName, yyyy, mm, dd) SELECT m.itemId, m.productId, p.styleName, YEAR(m.ts), MONTH(m.ts), DAY(m.ts) FROM Moments m JOIN Products p ON m.productId=p.sku WHERE m.isFlag=0;
'''