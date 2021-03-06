from datetime import datetime,timezone
import requests
from dateutil.relativedelta import relativedelta
from time import sleep
import mysql.connector

#now = datetime.now(timezone.utc)
siteId = '1597647a-7056-3fe9-94c1-ae5c9d16d69b'

now = datetime.utcnow() - relativedelta(seconds=3600)

url = 'http://44.192.77.149/v1/bar/' + siteId + '/data/event/item?q=timestamp%3Agt(' + requests.utils.quote(str(now.replace(tzinfo=timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'))) + ')&order=timestamp%3Adesc&size=200000&returnCount=false'
#sleep(10)
#print(str(url))
headers = {'Authorization': '2993A070-1E86-4967-8C93-D592602EDD30', 'Accept': 'application/json' , 'Content-Type': 'application/json'}

cnxn = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37", database="lulu")
added = 0
deleted = 0

response = requests.request("GET", url, headers=headers)
jsonResponse = response.json()
for o in jsonResponse['content']:
    #print(str(o))
    cursor = cnxn.cursor()
    isValid = 0
    isMove = 0
    isRegion = 0
    isReacquired = 0
    isMissing = 0
    isGhost = 0
    isExit = 0
    isDeparture = 0
    #'2021-10-22T20:16:07.468Z'
    ts = o['timestamp'].replace('T', ' ')
    ts = ts.replace('Z', '')
    tsData = o['timestamp'].split('T')
    tsData2 = tsData[0].split('-')
    yyyy = tsData2[0]
    mm = tsData2[1]
    dd = tsData2[2]
    #SELECT CONVERT_TZ('2009-03-04T17:49:20Z', '+00:00', '+00:00')
    #str_to_date('2009-03-04T17:49:20Z', '%Y-%m-%dT%H:%i:%sZ')
    if o['state'] == 'VALID':
        isValid = 1
    if 'POSITION_CHANGE' in o['events']:
        isMove = 1
    if 'EXIT' in o['events']:
        isExit = 1
    if 'REGION_CHANGE' in o['events']:
        isRegion = 1
    if 'GHOST' in o['events']:
        isGhost = 1
    if 'MISSING' in o['events']:
        isMissing = 1
    if 'REACQUIRED' in o['events']:
        isReacquired = 1
    if 'DEPARTURE' in o['events']:
        isDeparture = 1
    if 'VALID' in o['events']:
        isValid = 1
    sql = "INSERT INTO EpcMovement (id, productId, storeId, storeName, regionId, regionName, ts, x, y, z, confidence, isDeparture, isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isValid, yyyy, mm, dd) VALUES ('" + o['id'] + "', '" + o['productId'] + "', '" + o['site'] + "', '" + o['siteName'] + "', '" + o['region'] + "', '" + o['regionName'] + "', '" + str(ts) + "', " + str(o['x']) + ", " + str(o['y']) + ", " + str(o['z']) + ", " + str(o['confidence']) + ", " + str(isDeparture) + ", " + str(isExit) + ", " + str(isGhost) + ", " + str(isMissing) + ", " + str(isMove) + ", " + str(isReacquired) + ", " + str(isRegion) + ", " + str(isValid) + ", " + str(yyyy) + ", " + str(mm) + ", " + str(dd) + ")"
   
    try:
        cursor = cnxn.cursor()
        cursor.execute(sql)
        cnxn.commit()
        added = added + 1
    except Exception as e:
        print(str(e))
        deleted = deleted + 1
    print("Added: " + str(added) + ", Errors: " + str(deleted))




