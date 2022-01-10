from datetime import datetime,timezone
import requests
from dateutil.relativedelta import relativedelta
from time import sleep
import mysql.connector
import sys
import math

siteIndex = int(sys.argv[1])
dbName = sys.argv[2]

cnxn = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database=dbName)
dddd = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database=dbName)
#eeee = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database=dbName)
now = datetime.now(timezone.utc)
lastNow = now

siteIds = ['1597647a-7056-3fe9-94c1-ae5c9d16d69b', 'd4f87b6f-5199-43ac-b231-fbe6e3a8039c']
siteId = siteIds[siteIndex]
now = '2021-12-01 5:30:00'
d3 = dddd.cursor()
d3.execute("SELECT MAX(ts) FROM EpcMovement")
myres = d3.fetchall()
for rrr in myres:
    now = rrr[0]
while True:
    try:
        now = datetime.strptime(str(now), '%Y-%m-%d %H:%M:%S')
        try:
            added = 0
            deleted = 0
            updated = 0
            print("New query for store: " + str(siteId))
            url = 'http://3.235.171.79/v1/bar/' + siteId + '/data/event/item?q=timestamp%3Agt(' + requests.utils.quote(str(now.replace(tzinfo=timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'))) + ')&order=timestamp%3Aasc&size=50000&returnCount=false'
            #url = 'http://44.192.77.149/v1/bar/' + siteId + '/data/event/item?order=timestamp%3Aasc&size=10000&returnCount=false'
            headers = {'Authorization': 'APIKEY 2993A070-1E86-4967-8C93-D592602EDD30', 'Accept': 'application/json' , 'Content-Type': 'application/json'}
            response = requests.request("GET", url, headers=headers)
            print("Got data")
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
                x1 = o['timestamp'].split('T')
                x2 = x1[1].split(':')
                h = int(str(x2[0])
                m = floor(float(str(x2[1]))/20.0)
                ts = o['timestamp'].replace('T', ' ')
                ts = ts.replace('Z', '')
                tsD = ts.split('.')
                now = str(tsD[0])
                tsData = o['timestamp'].split('T')
                tsData2 = tsData[0].split('-')
                yyyy = tsData2[0]
                mm = tsData2[1]
                dd = tsData2[2]
                tempKey = o['id'] + '_' + o['region']  + '_' + str(yyyy) + '_' + str(mm) + '_' + str(dd) + '_' + str(h) + '_' + str(m)
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
                sql = "INSERT INTO EpcMovement (id, productId, storeId, storeName, regionId, regionName, ts, x, y, z, confidence, isDeparture, isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isValid, yyyy, mm, dd, tempKey) VALUES ('" + o['id'] + "', '" + o['productId'] + "', '" + o['site'] + "', '" + o['siteName'] + "', '" + o['region'] + "', '" + o['regionName'] + "', '" + str(ts) + "', " + str(o['x']) + ", " + str(o['y']) + ", " + str(o['z']) + ", " + str(o['confidence']) + ", " + str(isDeparture) + ", " + str(isExit) + ", " + str(isGhost) + ", " + str(isMissing) + ", " + str(isMove) + ", " + str(isReacquired) + ", " + str(isRegion) + ", " + str(isValid) + ", " + str(yyyy) + ", " + str(mm) + ", " + str(dd) + ", '" + str(tempKey) + "')"
                try:
                    cursor = cnxn.cursor()
                    cursor.execute(sql)
                    cnxn.commit()
                    added = added + 1
                except Exception as e:
                    sql = "UPDATE EpcMovement SET isExit=isExit+%s, isGhost=isGhost+%s, isMissing=isMissing+%s, isMove=isMove+%s, isReacquired=isReacquired+%s, isRegion=isRegion+%s, isValid=isValid+%s WHERE id=%s AND ts=%s AND x=%s AND y=%s"
                    vals = (isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isValid, o['id'], ts, o['x'], o['y'])
  
                    try:
                        cursor = cnxn.cursor()
                        cursor.execute(sql, vals)
                        cnxn.commit()
                        updated = updated + 1
                    except Exception as e:
                        deleted = deleted + 1
                print("Added: " + str(added) + ", Updated: "+ str(updated)+ ",  Duplicates: " + str(deleted) + ", for store: " + str(siteId) + " at: " + str(now))
        except Exception as e:
            print("Error making API call")
            print(str(e))
        '''
        print("Updating ValidEpc")
        e4 = eeee.cursor()
        e4.execute("DROP TABLE IF EXISTS ValidEpc_Bak")
        eeee.commit()
        e4.execute("CREATE TABLE ValidEpc_Bak (	id VARCHAR(30) NOT NULL, ts DATETIME NOT NULL, productId VARCHAR(40) NOT NULL, storeId VARCHAR(40) NOT NULL, PRIMARY KEY (id, productId, storeId, ts))")
        eeee.commit()
        e4.execute("INSERT INTO ValidEpc_Bak (id, productId, storeId, ts) SELECT e.id, e.productId, e.storeId, MAX(e.ts) FROM EpcMovement e JOIN Products p ON e.productId=p.sku GROUP BY e.id, e.productId, e.storeId ")
        eeee.commit()
        e4.execute("DROP TABLE IF EXISTS ValidEpc")
        eeee.commit()
        e4.execute("RENAME TABLE ValidEpc_Bak TO ValidEpc")
        eeee.commit()
        e4.execute("DROP TABLE IF EXISTS AllStyle_Bak")
        eeee.commit()
        e4.execute("CREATE TABLE AllStyle_Bak (storeId VARCHAR(40),deptCode VARCHAR(50), deptName VARCHAR(100),  subDeptCode varchar(50) NULL, subDeptName varchar(100) NULL, classCode varchar(50) NULL, className varchar(100) NULL, subClassCode varchar(50) NULL, subClassName varchar(100) NULL, styleCode varchar(50) NULL, styleName varchar(100) NULL, total INTEGER DEFAULT 0 )")
        eeee.commit()
        e4.execute("INSERT INTO AllStyle_Bak (storeId, deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName, styleCode, styleName, total) SELECT  x.storeId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, p.subClassCode, p.subClassName, p.styleCode, p.styleName, COUNT(*)  FROM ValidEpc x JOIN Products p ON x.productId=p.sku GROUP BY x.storeId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, p.subClassCode, p.subClassName, p.styleCode, p.styleName")
        eeee.commit()
        e4.execute("DROP TABLE IF EXISTS AllStyle")
        eeee.commit()
        e4.execute("RENAME TABLE AllStyle_Bak TO AllStyle")
        eeee.commit()
        print("Finished Updating ValidEpc")
        '''
        print("Sleeping now")
        sleep(20)
    except Exception as e:
        print(str(e))
    

