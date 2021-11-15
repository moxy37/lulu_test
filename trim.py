import mysql.connector
import sys

sizeLimit = int(sys.argv[1])

cnxn = mysql.connector.connect(host="localhost", user="luluuser", passwd="Moxy..37Moxy..37", database="lulu")

total = 42
current = 1
c = cnxn.cursor()
#Step 1
c.execute("DROP TABLE IF EXISTS EpcMax")
cnxn.commit()
print("Command " + str(current) + " of " + str(total))
current = current + 1
#Step 2
c.execute("CREATE TABLE EpcMax (id VARCHAR(30), productId VARCHAR(40), storeId VARCHAR(40), yyyy INTEGER, mm INTEGER, dd INTEGER, h INTEGER, isMove INTEGER, isRegion INTEGER, isExit INTEGER, isMissing INTEGER, isReacquired INTEGER, isValid INTEGER, isGhost INTEGER, minX FLOAT, minY FLOAT, maxX FLOAT, maxY FLOAT, avgX FLOAT, avgY FLOAT, ts DATETIME, total INTEGER, tempKey VARCHAR(255))")
cnxn.commit()
#Step 3
print("Command " + str(current) + " of " + str(total))
current = current + 1
#Step 4
c.execute("INSERT INTO EpcMax (id, productId, storeId, yyyy, mm, dd, h, isMove, isRegion, isExit, isMissing, isReacquired, isValid, isGhost, minX, minY, maxX, maxY, avgX, avgY, ts, total) SELECT id, productId, storeId, yyyy, mm, dd, HOUR(ts), MAX(isMove), MAX(isRegion), MAX(isExit), MAX(isMissing), MAX(isReacquired), MAX(isValid), MAX(isGhost), MIN(x), MIN(y), MAX(x), MAX(y), AVG(x), AVG(y), MAX(ts), COUNT(*) FROM EpcMovement GROUP BY id, storeId, productId, yyyy, mm, dd, HOUR(ts)")
cnxn.commit()
#Step 5
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("UPDATE EpcMax SET tempKey = CONCAT(id,'_',storeId,'_',CAST(yyyy AS CHAR),'_',CAST(mm AS CHAR),'_',CAST(dd AS CHAR),'_',CAST(h AS CHAR))")
cnxn.commit()
#Step 6
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("UPDATE EpcMovement SET tempKey= CONCAT(id,'_',storeId,'_',CAST(yyyy AS CHAR),'_',CAST(mm AS CHAR),'_',CAST(dd AS CHAR),'_',CAST(HOUR(ts) AS CHAR)) WHERE tempKey IS NULL")
cnxn.commit()
#Step 7
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("DROP TABLE IF EXISTS EpcMax_Bak")
cnxn.commit()
#Step 8
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("CREATE TABLE EpcMax_Bak (id VARCHAR(30), productId VARCHAR(40), storeId VARCHAR(40), yyyy INTEGER, mm INTEGER, dd INTEGER, h INTEGER, isMove INTEGER, isRegion INTEGER, isExit INTEGER, isMissing INTEGER, isReacquired INTEGER, isValid INTEGER, isGhost INTEGER, minX FLOAT, minY FLOAT, maxX FLOAT, maxY FLOAT, avgX FLOAT, avgY FLOAT, ts DATETIME, total INTEGER, tempKey VARCHAR(255) )")
cnxn.commit()
#Step 9
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("INSERT INTO EpcMax_Bak (id, productId, storeId, yyyy, mm, dd, h, isMove, isRegion, isExit, isMissing, isReacquired, isValid, isGhost, minX, minY, maxX, maxY, avgX, avgY, ts, total, tempKey) SELECT id, productId, storeId, yyyy, mm, dd, h, isMove, isRegion, isExit, isMissing, isReacquired, isValid, isGhost, minX, minY, maxX, maxY, avgX, avgY, ts, total, tempKey FROM EpcMax WHERE total>"+str(sizeLimit))
cnxn.commit()
#Step 10
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("CREATE INDEX epcmax1 ON EpcMax_Bak(tempKey)")
cnxn.commit()
#Step 11
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("CREATE INDEX epc111 ON EpcMovement(tempKey)")
cnxn.commit()
#Step 12
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("CREATE INDEX epc1111 ON EpcMovement (tempKey, ts)")
cnxn.commit()
#Step 13
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("CREATE INDEX epcmax31 ON EpcMax_Bak(tempKey, ts)")
cnxn.commit()
#Step 14
c.execute("UPDATE EpcMovement t1 INNER JOIN EpcMax_Bak t2 ON t1.tempKey=t2.tempKey SET t1.isDeleted=1")
cnxn.commit()
#Step 15
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("ALTER TABLE EpcMovement DROP PRIMARY KEY")
cnxn.commit()
#Step 16
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("UPDATE EpcMovement t1 INNER JOIN EpcMax_Bak t2 ON t1.tempKey=t2.tempKey AND t1.ts=t2.ts AND t1.isDeleted=1 SET t1.isDeleted=0, t1.isExit=t2.isExit, t1.isGhost=t2.isGhost, t1.isMissing=t2.isMissing, t1.isMove=t2.isMove, t1.isReacquired=t2.isReacquired, t1.isRegion=t2.isRegion, t1.isValid=t2.isValid, t1.x=t2.avgX, t1.y=t2.avgY")
cnxn.commit()
#Step 17
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("DROP TABLE IF EXISTS EpcMovement_TEMP2")
cnxn.commit()
#Step 18
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("CREATE TABLE EpcMovement_TEMP2 (id VARCHAR(30) NOT NULL, productId VARCHAR(40) NOT NULL, storeId VARCHAR(40) NOT NULL, storeName VARCHAR(250), regionId VARCHAR(40) NOT NULL, regionName VARCHAR(250), ts DATETIME NOT NULL, soldTimestamp DATETIME, x FLOAT DEFAULT 0 NOT NULL, y FLOAT DEFAULT 0 NOT NULL, z FLOAT DEFAULT 0, confidence FLOAT DEFAULT 0, isDeleted INTEGER DEFAULT 0, isDeparture INTEGER NOT NULL DEFAULT 0, isExit INTEGER NOT NULL DEFAULT 0, isGhost INTEGER NOT NULL DEFAULT 0, isMissing INTEGER NOT NULL DEFAULT 0, isMove INTEGER NOT NULL DEFAULT 0, isReacquired INTEGER NOT NULL DEFAULT 0, isRegion INTEGER NOT NULL DEFAULT 0, isSold INTEGER NOT NULL DEFAULT 0, isValid INTEGER NOT NULL DEFAULT 0, yyyy INTEGER, mm INTEGER, dd INTEGER, lastX FLOAT DEFAULT 0, lastY FLOAT DEFAULT 0, dLast FLOAT DEFAULT 0, dHome FLOAT DEFAULT 0, isUpdated INTEGER DEFAULT 0, tempKey VARCHAR(255), PRIMARY KEY (id, productId, storeId, regionId, ts, x, y))")
cnxn.commit()
#Step 19
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("DELETE FROM EpcMovement WHERE isDeleted=1")
cnxn.commit()
#Step 20
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("INSERT INTO EpcMovement_TEMP2 (id, productId, storeId, storeName, regionId, regionName, ts, soldTimestamp, x, y, z, confidence, isDeleted, isDeparture, isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isValid, yyyy, mm, dd, lastX, lastY, dLast, dHome, isUpdated) SELECT id, productId, storeId, storeName, regionId, regionName, ts, MAX(soldTimestamp), x, y, z, MAX(confidence), MAX(isDeleted), MAX(isDeparture), MAX(isExit), MAX(isGhost), MAX(isMissing), MAX(isMove), MAX(isReacquired), MAX(isRegion), MAX(isValid), MAX(yyyy), MAX(mm), MAX(dd), MAX(lastX), MAX(lastY), MAX(dLast), MAX(dHome), MAX(isUpdated) FROM EpcMovement GROUP BY id, productId, storeId, storeName, regionId, regionName, ts, x, y, z")
cnxn.commit()
#Step 21
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("DROP TABLE IF EXISTS EpcMovement")
cnxn.commit()
#Step 22
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("RENAME TABLE EpcMovement_TEMP2 TO EpcMovement")
cnxn.commit()
#Step 23
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("UPDATE EpcMovement SET tempKey= CONCAT(id,'_',storeId,'_',CAST(yyyy AS CHAR),'_',CAST(mm AS CHAR),'_',CAST(dd AS CHAR),'_',CAST(HOUR(ts) AS CHAR))")
cnxn.commit()
#Step 24
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("DROP TABLE IF EXISTS EpcMax")
cnxn.commit()
#Step 25
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("DROP TABLE IF EXISTS EpcMax_Bak")
cnxn.commit()
#Step 26
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("ALTER TABLE EpcMovement ADD styleCode VARCHAR(50)")
cnxn.commit()
#Step 27
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("UPDATE EpcMovement t1 INNER JOIN Products t2 ON t1.productId=t2.sku SET t1.styleCode=t2.styleCode")
cnxn.commit()
#Step 28
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("DROP TABLE IF EXISTS ValidEpc_Bak")
cnxn.commit()
#Step 29
c.execute("CREATE TABLE ValidEpc_Bak (	id VARCHAR(30) NOT NULL, ts DATETIME NOT NULL, productId VARCHAR(40) NOT NULL, storeId VARCHAR(40) NOT NULL, PRIMARY KEY (id, productId, storeId, ts))")
cnxn.commit()
#Step 30
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("INSERT INTO ValidEpc_Bak (id, productId, storeId, ts) SELECT e.id, e.productId, e.storeId, MAX(e.ts) FROM EpcMovement e JOIN Products p ON e.productId=p.sku GROUP BY e.id, e.productId, e.storeId")
cnxn.commit()
#Step 31
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("DROP TABLE IF EXISTS ValidEpc")
cnxn.commit()
#Step 32
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("RENAME TABLE ValidEpc_Bak TO ValidEpc")
cnxn.commit()
#Step 33
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("DROP TABLE IF EXISTS AllStyle_Bak")
cnxn.commit()
#Step 34
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("CREATE TABLE AllStyle_Bak (storeId VARCHAR(40),deptCode VARCHAR(50), deptName VARCHAR(100),  subDeptCode varchar(50) NULL, subDeptName varchar(100) NULL, classCode varchar(50) NULL, className varchar(100) NULL, subClassCode varchar(50) NULL, subClassName varchar(100) NULL, styleCode varchar(50) NULL, styleName varchar(100) NULL, total INTEGER DEFAULT 0)")
cnxn.commit()
#Step 35
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("INSERT INTO AllStyle_Bak (storeId, deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName, styleCode, styleName, total) SELECT  x.storeId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, p.subClassCode, p.subClassName, p.styleCode, p.styleName, COUNT(*)  FROM ValidEpc x JOIN Products p ON x.productId=p.sku GROUP BY x.storeId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, p.subClassCode, p.subClassName, p.styleCode, p.styleName")
cnxn.commit()
#Step 36
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("DROP TABLE IF EXISTS AllStyle")
cnxn.commit()
#Step 37
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("RENAME TABLE AllStyle_Bak TO AllStyle")
cnxn.commit()
#Step 38
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("UPDATE EpcMovement SET soldTimestamp=NULL")
cnxn.commit()
#Step 39
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("UPDATE EpcMovement t1 INNER JOIN Sales t2 ON t1.id=t2.id AND t1.storeId=t2.storeId SET t1.soldTimestamp=t2.soldTimestamp")
cnxn.commit()
#Step 40
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("UPDATE EpcMovement SET isSold=0")
cnxn.commit()
#Step 41
print("Command " + str(current) + " of " + str(total))
current = current + 1
c.execute("UPDATE EpcMovement SET isSold=1 WHERE ts>DATE_ADD(soldTimestamp, INTERVAL -3 HOUR)")
cnxn.commit()
#Step 42
print("Command " + str(current) + " of " + str(total))
current = current + 1