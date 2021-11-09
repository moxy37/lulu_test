DROP TABLE IF EXISTS EpcMoveCombined;
CREATE TABLE EpcMoveCombined (
	idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id VARCHAR(30),
	productId VARCHAR(40),
	storeId VARCHAR(40),
	regionId VARCHAR(40),
	ts DATETIME,
	soldTimestamp DATETIME,
	x FLOAT DEFAULT 0,
	y FLOAT DEFAULT 0,
	confidence FLOAT DEFAULT 0,
	lastX FLOAT DEFAULT 0,
	lastY FLOAT DEFAULT 0,
	dHome FLOAT DEFAULT 0,
    dLast FLOAT DEFAULT 0,
    homeX FLOAT DEFAULT 0,
    homeY FLOAT DEFAULT 0,
    isDeparture INTEGER DEFAULT 0,
	isExit INTEGER DEFAULT 0,
	isGhost INTEGER DEFAULT 0,
	isMissing INTEGER DEFAULT 0,
	isMove INTEGER DEFAULT 0,
	isReacquired INTEGER DEFAULT 0,
	isRegion INTEGER DEFAULT 0,
	isSold INTEGER DEFAULT 0,
	isValid INTEGER DEFAULT 0
);

CREATE INDEX test2 ON EpcMoveCombined (id, idx, lastX, lastY);
CREATE INDEX test23 ON EpcMoveCombined (id, idx, lastX, lastY, storeId);

CREATE INDEX temp_me_god ON EpcMovement (id, productId, storeId, regionId, ts, x, y, confidence);
CREATE INDEX s222 ON EpcMovement (id, productId, storeId);
CREATE INDEX s222x ON EpcMovement (idx, id, productId, storeId);
CREATE INDEX temp_me_DDDDD ON EpcMovement (id, productId, storeId, isDeleted, isDeparture, isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isSold, isValid, idx);

DROP TABLE IF EXISTS Zones;
CREATE TABLE Zones (
    productId VARCHAR(40) NOT NULL,
    storeId VARCHAR(40),
    zoneNumber INTEGER NOT NULL,
    radius FLOAT DEFAULT 0,
    xCenter FLOAT DEFAULT 0,
    yCenter FLOAT DEFAULT 0,
    xMin FLOAT DEFAULT 0,
    yMin FLOAT DEFAULT 0,
    xMax FLOAT DEFAULT 0,
    yMax FLOAT DEFAULT 0,
    inZoneCount INTEGER DEFAULT 0,
    isHome INTEGER DEFAULT 0,
    k INTEGER,
    radiusAvg FLOAT DEFAULT 0,
    radiusSD FLOAT DEFAULT 0,
    percentInZone FLOAT DEFAULT 0,
    totalCount INTEGER DEFAULT 0
);

DROP TABLE IF EXISTS LastCord;
CREATE TABLE LastCord (
        idx INTEGER NOT NULL PRIMARY KEY,
        lastIdx INTEGER DEFAULT 0,
        x FLOAT,
        y FLOAT,
        storeId VARCHAR(40),
        id VARCHAR(30)
);


INSERT INTO EpcMoveCombined (id, productId, storeId, regionId, ts, x, y, confidence, isDeparture, isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isSold, isValid) SELECT id, productId, storeId, regionId, ts, x, y, confidence, isDeparture, isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isSold, isValid FROM EpcMovement ORDER BY id, ts;

INSERT INTO LastCord (idx, x, y, id, storeId) SELECT idx, x, y, id, storeId FROM EpcMoveCombined ORDER BY idx;

UPDATE LastCord SET lastIdx = idx + 1;

UPDATE EpcMoveCombined t1 INNER JOIN LastCord t2 ON t1.idx = t2.lastIdx AND t1.id=t2.id AND t1.storeId=t2.storeId SET t1.lastX=t2.x, t1.lastY=t2.y;



UPDATE EpcMoveCombined SET dLast = SQRT((x - lastX)*(x - lastX) + (y - lastY)*(y - lastY));



SELECT COUNT(*) FROM EpcMoveCombined;
--RUN THE COMMAND "python3 cluster.py 2"
--RUN THE COMMAND "python3 cluster.py 3"
--RUN THE COMMAND "python3 cluster.py 4"


UPDATE EpcMoveCombined t1 INNER JOIN Zones t2 ON t1.productId=t2.productId AND t2.k=2 AND t1.storeId=t2.storeId AND t2.isHome=1 SET t1.homeX=t2.xCenter, t1.homeY=t2.yCenter;

UPDATE EpcMoveCombined SET dHome = SQRT((x - homeX)*(x - homeX) + (y - homeY)*(y - homeY));

UPDATE EpcMoveCombined t1 INNER JOIN Sales t2 ON t1.id=t2.id AND t1.storeId=t2.storeId SET t1.soldTimestamp=t2.soldTimestamp;


UPDATE EpcMoveCombined SET isSold=0;
UPDATE EpcMoveCombined SET isSold=1 WHERE ts>DATE_ADD(soldTimestamp, INTERVAL -3 HOUR); 




CREATE INDEX epc_test_4 ON EpcMovement (id, productId, storeId, isDeleted, isDeparture, isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isSold, isValid, idx);



SELECT id, productId, storeId, MAX(isDeleted), MAX(isDeparture), MAX(isExit), MAX(isGhost), MAX(isMissing), MAX(isMove), MAX(isReacquired), MAX(isRegion), MAX( isSold), MAX(isValid), MAX(idx) FROM EpcMovement GROUP BY storeId, productId, id





--THIS IS ALL NEEDED FOR PRUNNING
DROP TABLE IF EXISTS EpcMax;
CREATE TABLE EpcMax (
    id VARCHAR(30),
	productId VARCHAR(40),
    storeId VARCHAR(40),
    yyyy INTEGER,
    mm INTEGER,
    dd INTEGER,
    h INTEGER,
    isMove INTEGER,
    isRegion INTEGER,
    isExit INTEGER,
    isMissing INTEGER,
    isReacquired INTEGER,
    isValid INTEGER,
    isGhost INTEGER,
    minX FLOAT,
    minY FLOAT,
    maxX FLOAT,
    maxY FLOAT,
    avgX FLOAT,
    avgY FLOAT,
    ts DATETIME,
    total INTEGER,
    tempKey VARCHAR(255)
);

ALTER TABLE EpcMax ADD tempKey VARCHAR(255);

INSERT INTO EpcMax (id, productId, storeId, yyyy, mm, dd, h, isMove, isRegion, isExit, isMissing, isReacquired, isValid, isGhost, minX, minY, maxX, maxY, avgX, avgY, ts, total) SELECT id, productId, storeId, yyyy, mm, dd, HOUR(ts), MAX(isMove), MAX(isRegion), MAX(isExit), MAX(isMissing), MAX(isReacquired), MAX(isValid), MAX(isGhost), MIN(x), MIN(y), MAX(x), MAX(y), AVG(x), AVG(y), MAX(ts), COUNT(*) FROM EpcMovement GROUP BY id, storeId, productId, yyyy, mm, dd, HOUR(ts);

UPDATE EpcMax SET tempKey = CONCAT(id,'_',storeId,'_',CAST(yyyy AS CHAR),'_',CAST(mm AS CHAR),'_',CAST(dd AS CHAR),'_',CAST(h AS CHAR));

UPDATE EpcMovement SET isDeleted=1 WHERE CONCAT(id,'_',storeId,'_',CAST(yyyy AS CHAR),'_',CAST(mm AS CHAR),'_',CAST(dd AS CHAR),'_',CAST(HOUR(ts) AS CHAR)) IN (SELECT tempKey FROM EpcMax WHERE total>100);

ALTER EpcMovement ADD tempKey VARCHAR(255);
UPDATE EpcMovement SET tempKey= CONCAT(id,'_',storeId,'_',CAST(yyyy AS CHAR),'_',CAST(mm AS CHAR),'_',CAST(dd AS CHAR),'_',CAST(HOUR(ts) AS CHAR));



DROP TABLE IF EXISTS EpcMax_Bak;

CREATE TABLE EpcMax_Bak (
    id VARCHAR(30),
	productId VARCHAR(40),
    storeId VARCHAR(40),
    yyyy INTEGER,
    mm INTEGER,
    dd INTEGER,
    h INTEGER,
    isMove INTEGER,
    isRegion INTEGER,
    isExit INTEGER,
    isMissing INTEGER,
    isReacquired INTEGER,
    isValid INTEGER,
    isGhost INTEGER,
    minX FLOAT,
    minY FLOAT,
    maxX FLOAT,
    maxY FLOAT,
    avgX FLOAT,
    avgY FLOAT,
    ts DATETIME,
    total INTEGER,
    tempKey VARCHAR(255)
);

INSERT INTO EpcMax_Bak (id, productId, storeId, yyyy, mm, dd, h, isMove, isRegion, isExit, isMissing, isReacquired, isValid, isGhost, minX, minY, maxX, maxY, avgX, avgY, ts, total, tempKey) SELECT id, productId, storeId, yyyy, mm, dd, h, isMove, isRegion, isExit, isMissing, isReacquired, isValid, isGhost, minX, minY, maxX, maxY, avgX, avgY, ts, total, tempKey FROM EpcMax WHERE total>100;



CREATE INDEX epcmax1 ON EpcMax_Bak(tempKey);
CREATE INDEX epc111 ON EpcMovement(tempKey);
CREATE INDEX epc1111 ON EpcMovement (tempKey, ts);
CREATE INDEX epcmax31 ON EpcMax_Bak(tempKey, ts);

UPDATE EpcMovement t1 INNER JOIN EpcMax_Bak t2 ON t1.tempKey=t2.tempKey SET t1.isDeleted=1;

ALTER TABLE EpcMovement DROP PRIMARY KEY;

UPDATE EpcMovement t1 INNER JOIN EpcMax_Bak t2 ON t1.tempKey=t2.tempKey AND t1.ts=t2.ts AND t1.isDeleted=1 SET t1.isDeleted=0, t1.isExit=t2.isExit, t1.isGhost=t2.isGhost, t1.isMissing=t2.isMissing, t1.isMove=t2.isMove, t1.isReacquired=t2.isReacquired, t1.isRegion=t2.isRegion, t1.isValid=t2.isValid, t1.x=t2.avgX, t1.y=t2.avgY;





DROP TABLE IF EXISTS EpcMovement_TEMP;

CREATE TABLE EpcMovement_TEMP (
	id VARCHAR(30) NOT NULL,
	productId VARCHAR(40) NOT NULL,
	storeId VARCHAR(40) NOT NULL,
	storeName VARCHAR(250),
	regionId VARCHAR(40) NOT NULL,
	regionName VARCHAR(250),
	ts DATETIME NOT NULL,
	soldTimestamp DATETIME,
	x FLOAT DEFAULT 0 NOT NULL,
	y FLOAT DEFAULT 0 NOT NULL,
	z FLOAT DEFAULT 0,
	confidence FLOAT DEFAULT 0,
	isDeleted INTEGER DEFAULT 0,
	isDeparture INTEGER NOT NULL DEFAULT 0,
	isExit INTEGER NOT NULL DEFAULT 0,
	isGhost INTEGER NOT NULL DEFAULT 0,
	isMissing INTEGER NOT NULL DEFAULT 0,
	isMove INTEGER NOT NULL DEFAULT 0,
	isReacquired INTEGER NOT NULL DEFAULT 0,
	isRegion INTEGER NOT NULL DEFAULT 0,
	isSold INTEGER NOT NULL DEFAULT 0,
	isValid INTEGER NOT NULL DEFAULT 0,
	yyyy INTEGER,
	mm INTEGER,
	dd INTEGER,
	lastX FLOAT DEFAULT 0,
	lastY FLOAT DEFAULT 0,
	dLast FLOAT DEFAULT 0,
	dHome FLOAT DEFAULT 0,
	isUpdated INTEGER DEFAULT 0,
	tempKey VARCHAR(255)
);

INSERT INTO EpcMovement_TEMP (id, productId, storeId, storeName, regionId, regionName, ts, soldTimestamp, x, y, z, confidence, isDeleted, isDeparture, isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isValid, yyyy, mm, dd, lastX, lastY, dLast, dHome, isUpdated, tempKey) SELECT id, productId, storeId, storeName, regionId, regionName, ts, soldTimestamp, x, y, z, confidence, isDeleted, isDeparture, isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isValid, yyyy, mm, dd, lastX, lastY, dLast, dHome, isUpdated, tempKey FROM EpcMovement WHERE isDeleted=1;




DROP TABLE IF EXISTS EpcMovement_TEMP2;

CREATE TABLE EpcMovement_TEMP2 (
	id VARCHAR(30) NOT NULL,
	productId VARCHAR(40) NOT NULL,
	storeId VARCHAR(40) NOT NULL,
	storeName VARCHAR(250),
	regionId VARCHAR(40) NOT NULL,
	regionName VARCHAR(250),
	ts DATETIME NOT NULL,
	soldTimestamp DATETIME,
	x FLOAT DEFAULT 0 NOT NULL,
	y FLOAT DEFAULT 0 NOT NULL,
	z FLOAT DEFAULT 0,
	confidence FLOAT DEFAULT 0,
	isDeleted INTEGER DEFAULT 0,
	isDeparture INTEGER NOT NULL DEFAULT 0,
	isExit INTEGER NOT NULL DEFAULT 0,
	isGhost INTEGER NOT NULL DEFAULT 0,
	isMissing INTEGER NOT NULL DEFAULT 0,
	isMove INTEGER NOT NULL DEFAULT 0,
	isReacquired INTEGER NOT NULL DEFAULT 0,
	isRegion INTEGER NOT NULL DEFAULT 0,
	isSold INTEGER NOT NULL DEFAULT 0,
	isValid INTEGER NOT NULL DEFAULT 0,
	yyyy INTEGER,
	mm INTEGER,
	dd INTEGER,
	lastX FLOAT DEFAULT 0,
	lastY FLOAT DEFAULT 0,
	dLast FLOAT DEFAULT 0,
	dHome FLOAT DEFAULT 0,
	isUpdated INTEGER DEFAULT 0,
	tempKey VARCHAR(255),
    PRIMARY KEY (id, productId, storeId, regionId, ts, x, y)
);



DELETE FROM EpcMovement WHERE isDeleted=1;

INSERT INTO EpcMovement_TEMP2 (id, productId, storeId, storeName, regionId, regionName, ts, soldTimestamp, x, y, z, confidence, isDeleted, isDeparture, isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isValid, yyyy, mm, dd, lastX, lastY, dLast, dHome, isUpdated) SELECT id, productId, storeId, storeName, regionId, regionName, ts, MAX(soldTimestamp), x, y, z, MAX(confidence), MAX(isDeleted), MAX(isDeparture), MAX(isExit), MAX(isGhost), MAX(isMissing), MAX(isMove), MAX(isReacquired), MAX(isRegion), MAX(isValid), MAX(yyyy), MAX(mm), MAX(dd), MAX(lastX), MAX(lastY), MAX(dLast), MAX(dHome), MAX(isUpdated) FROM EpcMovement GROUP BY id, productId, storeId, storeName, regionId, regionName, ts, x, y, z;

DROP TABLE EpcMovement;
RENAME TABLE EpcMovement_TEMP2 TO EpcMovement;
UPDATE EpcMovement SET tempKey= CONCAT(id,'_',storeId,'_',CAST(yyyy AS CHAR),'_',CAST(mm AS CHAR),'_',CAST(dd AS CHAR),'_',CAST(HOUR(ts) AS CHAR));
