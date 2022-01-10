UPDATE EpcMovement t1 INNER JOIN Products t2 ON t1.productId=t2.sku SET t1.styleCode=t2.styleCode;

DELETE FROM EpcMovement WHERE styleCode IS NULL;

DELETE FROM EpcMovement WHERE ts IS NULL;

DELETE FROM EpcMovement WHERE id IS NULL;

UPDATE EpcMovement SET yyyy=YEAR(ts), mm=MONTH(ts), dd=DAY(ts), soldTimestamp=NULL, isSold=0, isDeleted=0, isUpdated=0;

DROP TABLE IF EXISTS TempMe;

CREATE TABLE TempMe (id VARCHAR(30), yyyy INTEGER, mm INTEGER, dd INTEGER, dailyMoves INTEGER, PRIMARY KEY(id, yyyy, mm, dd));

INSERT INTO TempMe (id, yyyy, mm, dd, dailyMoves) SELECT id, yyyy, mm, dd, COUNT(*) FROM EpcMovement GROUP BY id, yyyy, mm, dd;

UPDATE EpcMovement t1 INNER JOIN TempMe t2 ON t1.id=t2.id AND t1.yyyy=t2.yyyy AND t1.mm=t2.mm AND t1.dd=t2.dd SET t1.dailyMoves=t2.dailyMoves;

UPDATE EpcMovement SET tempKey = CONCAT(id, '_', regionId, '_', CAST(yyyy AS CHAR), '_', CAST(mm AS CHAR), '_', CAST(dd AS CHAR), '_', CAST(HOUR(ts) AS CHAR), '_', CAST(FLOOR(MINUTE(ts)/20.0) AS CHAR));

DROP TABLE IF EXISTS TempMe;

DROP TABLE IF EXISTS EpcMax;

CREATE TABLE EpcMax (id VARCHAR(30), regionId VARCHAR(40), productId VARCHAR(40), storeId VARCHAR(40), yyyy INTEGER, mm INTEGER, dd INTEGER, h INTEGER, m INTEGER, isMove INTEGER, isRegion INTEGER, isExit INTEGER, isMissing INTEGER, isReacquired INTEGER, isValid INTEGER, isGhost INTEGER, minX FLOAT, minY FLOAT, maxX FLOAT, maxY FLOAT, avgX FLOAT, avgY FLOAT, ts DATETIME, total INTEGER, tempKey VARCHAR(255), dailyMoves INTEGER, INDEX(tempKey, ts), INDEX(tempKey));

INSERT INTO EpcMax (id, regionId, productId, storeId, yyyy, mm, dd, h, isMove, isRegion, isExit, isMissing, isReacquired, isValid, isGhost, minX, minY, maxX, maxY, avgX, avgY, ts, total, dailyMoves, tempKey) SELECT id, regionId, productId, storeId, yyyy, mm, dd, HOUR(ts), FLOOR(MINUTE(ts/20.0)), MAX(isMove), MAX(isRegion), MAX(isExit), MAX(isMissing), MAX(isReacquired), MAX(isValid), MAX(isGhost), MIN(x), MIN(y), MAX(x), MAX(y), AVG(x), AVG(y), MAX(ts), COUNT(*), MAX(dailyMoves), MAX(tempKey) FROM EpcMovement GROUP BY id, storeId, productId, yyyy, mm, dd, HOUR(ts), FLOOR(MINUTE(ts/20.0)), regionId;

DELETE FROM EpcMax WHERE dailyMoves<50;

UPDATE EpcMovement t1 INNER JOIN EpcMax t2 ON t1.tempKey=t2.tempKey SET t1.isDeleted=1;

ALTER TABLE EpcMovement DROP PRIMARY KEY;

UPDATE EpcMovement t1 INNER JOIN EpcMax t2 ON t1.tempKey=t2.tempKey AND t1.ts=t2.ts AND t1.isDeleted=1 SET t1.isDeleted=0, t1.isExit=t2.isExit, t1.isGhost=t2.isGhost, t1.isMissing=t2.isMissing, t1.isMove=t2.isMove, t1.isReacquired=t2.isReacquired, t1.isRegion=t2.isRegion, t1.isValid=t2.isValid, t1.x=t2.avgX, t1.y=t2.avgY;

DROP TABLE IF EXISTS EpcMax;

DROP TABLE IF EXISTS EpcMovement_NewBack;

CREATE TABLE EpcMovement_NewBack LIKE EpcMovement;

ALTER TABLE EpcMovement DISABLE KEYS;

ALTER TABLE EpcMovement_NewBack DISABLE KEYS;

INSERT INTO EpcMovement_NewBack SELECT * FROM EpcMovement;

ALTER TABLE EpcMovement ENABLE KEYS;

ALTER TABLE EpcMovement_NewBack ENABLE KEYS;

DELETE FROM EpcMovement WHERE isDeleted=1;

DROP TABLE IF EXISTS EpcMovement_TEMP2;

CREATE TABLE EpcMovement_TEMP2 (id VARCHAR(30) NOT NULL, productId VARCHAR(40) NOT NULL, storeId VARCHAR(40) NOT NULL, storeName VARCHAR(250), regionId VARCHAR(40) NOT NULL, regionName VARCHAR(250), ts DATETIME NOT NULL, soldTimestamp DATETIME, x FLOAT DEFAULT 0 NOT NULL, y FLOAT DEFAULT 0 NOT NULL, z FLOAT DEFAULT 0, confidence FLOAT DEFAULT 0, isDeleted INTEGER DEFAULT 0, isDeparture INTEGER NOT NULL DEFAULT 0, isExit INTEGER NOT NULL DEFAULT 0, isGhost INTEGER NOT NULL DEFAULT 0, isMissing INTEGER NOT NULL DEFAULT 0, isMove INTEGER NOT NULL DEFAULT 0, isReacquired INTEGER NOT NULL DEFAULT 0, isRegion INTEGER NOT NULL DEFAULT 0, isSold INTEGER NOT NULL DEFAULT 0, isValid INTEGER NOT NULL DEFAULT 0, yyyy INTEGER, mm INTEGER, dd INTEGER, lastX FLOAT DEFAULT 0, lastY FLOAT DEFAULT 0, dLast FLOAT DEFAULT 0, dHome FLOAT DEFAULT 0, isUpdated INTEGER DEFAULT 0, tempKey VARCHAR(255), dailyMoves INTEGER DEFAULT 0, styleCode VARCHAR(50), PRIMARY KEY (id, productId, storeId, regionId, ts, x, y), INDEX(id, yyyy, mm, dd));

INSERT INTO EpcMovement_TEMP2 (id, productId, storeId, storeName, regionId, regionName, ts, x, y, z, confidence, isDeparture, isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isValid, yyyy, mm, dd, tempKey) SELECT id, productId, storeId, storeName, regionId, regionName, ts, x, y, z, MAX(confidence), MAX(isDeparture), MAX(isExit), MAX(isGhost), MAX(isMissing), MAX(isMove), MAX(isReacquired), MAX(isRegion), MAX(isValid), MAX(yyyy), MAX(mm), MAX(dd), MAX(tempKey) FROM EpcMovement  GROUP BY id, productId, storeId, storeName, regionId, regionName, ts, x, y, z;

DROP TABLE EpcMovement;

RENAME TABLE EpcMovement_TEMP2 TO EpcMovement;

UPDATE EpcMovement t1 INNER JOIN Sales t2 ON t1.id=t2.id AND t1.storeId=t2.storeId SET t1.soldTimestamp=t2.soldTimestamp;

UPDATE EpcMovement SET isSold=1 WHERE ts>DATE_ADD(soldTimestamp, INTERVAL -4 HOUR); 

DROP TABLE IF EXISTS TempMe;

CREATE TABLE TempMe (id VARCHAR(30), yyyy INTEGER, mm INTEGER, dd INTEGER, dailyMoves INTEGER, PRIMARY KEY(id, yyyy, mm, dd));

INSERT INTO TempMe (id, yyyy, mm, dd, dailyMoves) SELECT id, yyyy, mm, dd, COUNT(*) FROM EpcMovement GROUP BY id, yyyy, mm, dd;

UPDATE EpcMovement t1 INNER JOIN TempMe t2 ON t1.id=t2.id AND t1.yyyy=t2.yyyy AND t1.mm=t2.mm AND t1.dd=t2.dd SET t1.dailyMoves=t2.dailyMoves;

DROP TABLE IF EXISTS TempMe;

UPDATE EpcMovement t1 INNER JOIN Products t2 ON t1.productId=t2.sku SET t1.styleCode=t2.styleCode;

DROP TABLE IF EXISTS ValidEpc_Bak;

CREATE TABLE ValidEpc_Bak (id VARCHAR(30) NOT NULL, ts DATETIME NOT NULL, productId VARCHAR(40) NOT NULL, storeId VARCHAR(40) NOT NULL, PRIMARY KEY (id, productId, storeId, ts));

INSERT INTO ValidEpc_Bak (id, productId, storeId, ts) SELECT e.id, e.productId, e.storeId, MAX(e.ts) FROM EpcMovement e JOIN Products p ON e.productId=p.sku GROUP BY e.id, e.productId, e.storeId ;

DROP TABLE IF EXISTS ValidEpc;

RENAME TABLE ValidEpc_Bak TO ValidEpc;

DROP TABLE IF EXISTS AllStyle_Bak;

CREATE TABLE AllStyle_Bak (storeId VARCHAR(40),deptCode VARCHAR(50), deptName VARCHAR(100),  subDeptCode varchar(50) NULL, subDeptName varchar(100) NULL, classCode varchar(50) NULL, className varchar(100) NULL, subClassCode varchar(50) NULL, subClassName varchar(100) NULL, styleCode varchar(50) NULL, styleName varchar(100) NULL, total INTEGER DEFAULT 0 );

INSERT INTO AllStyle_Bak (storeId, deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName, styleCode, styleName, total) SELECT  x.storeId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, p.subClassCode, p.subClassName, p.styleCode, p.styleName, COUNT(*)  FROM ValidEpc x JOIN Products p ON x.productId=p.sku GROUP BY x.storeId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, p.subClassCode, p.subClassName, p.styleCode, p.styleName;

DROP TABLE IF EXISTS AllStyle;

RENAME TABLE AllStyle_Bak TO AllStyle;