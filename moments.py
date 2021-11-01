import os
import ijson
import json
import mysql.connector
import datetime

cnxn = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")
added = 0
error = 0

with open('mom.json') as f:
    json_file = json.load(f)
    for o in json_file['content']:
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