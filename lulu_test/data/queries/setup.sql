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
    styleCode VARCHAR(50),
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
CREATE INDEX lastIdxIndex ON LastCord(idx, lastIdx, id);


INSERT INTO EpcMoveCombined (id, productId, storeId, regionId, ts, x, y, confidence, isDeparture, isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isSold, isValid, homeX, homeY, dHome) SELECT id, productId, storeId, regionId, ts, x, y, confidence, isDeparture, isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isSold, isValid, 0, 0, 0 FROM EpcMovement ORDER BY id, ts;

UPDATE EpcMoveCombined INNER JOIN Zones ON EpcMoveCombined.productId=Zones.productId AND Zones.k=2 AND Zones.isHome=1 SET EpcMoveCombined.homeX=Zones.xCenter, EpcMoveCombined.homeY=Zones.yCenter;

UPDATE EpcMoveCombined SET dHome = SQRT((x - homeX)*(x - homeX) + (y - homeY)*(y - homeY)) WHERE homeX>0 AND homeY>0;


INSERT INTO LastCord (idx, x, y, id, storeId) SELECT idx, x, y, id, storeId FROM EpcMoveCombined ORDER BY idx;

UPDATE LastCord SET lastIdx = idx + 1;

UPDATE EpcMoveCombined t1 INNER JOIN LastCord t2 ON t1.idx = t2.lastIdx AND t1.id=t2.id SET t1.lastX=t2.x, t1.lastY=t2.y;



UPDATE EpcMoveCombined SET dLast = SQRT((x - lastX)*(x - lastX) + (y - lastY)*(y - lastY)) WHERE lastX>0 AND lastY>0;

UPDATE EpcMovement t1 INNER JOIN EpcMoveCombined t2 ON t1.id=t2.id AND t1.ts=t2.ts AND t1.x=t2.x AND t1.y=t2.y SET t1.dLast=t2.dLast, t1.lastX=t2.lastX, t1.lastY=t2.lastY;

SELECT COUNT(*) FROM EpcMoveCombined WHERE isSold=1;
--RUN THE COMMAND "python3 cluster.py 2"
--RUN THE COMMAND "python3 cluster.py 3"
--RUN THE COMMAND "python3 cluster.py 4"

ALTER TABLE EpcMoveCombined ADD styleCode VARCHAR(50);
UPDATE EpcMoveCombined t1 INNER JOIN Products t2 ON t1.productId=t2.sku SET t1.styleCode=t2.styleCode;

UPDATE EpcMoveCombined t1 INNER JOIN Zones t2 ON t1.productId=t2.productId AND t2.k=2 AND t1.storeId=t2.storeId AND t2.isHome=1 SET t1.homeX=t2.xCenter, t1.homeY=t2.yCenter;

UPDATE EpcMoveCombined SET dHome = SQRT((x - homeX)*(x - homeX) + (y - homeY)*(y - homeY));

UPDATE EpcMoveCombined t1 INNER JOIN Sales t2 ON t1.id=t2.id AND t1.storeId=t2.storeId SET t1.soldTimestamp=t2.soldTimestamp;


UPDATE EpcMoveCombined SET isSold=0;
UPDATE EpcMoveCombined SET isSold=1 WHERE ts>DATE_ADD(soldTimestamp, INTERVAL -3 HOUR); 




CREATE INDEX epc_test_4 ON EpcMovement (id, productId, storeId, isDeleted, isDeparture, isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isSold, isValid, idx);



SELECT id, productId, storeId, MAX(isDeleted), MAX(isDeparture), MAX(isExit), MAX(isGhost), MAX(isMissing), MAX(isMove), MAX(isReacquired), MAX(isRegion), MAX( isSold), MAX(isValid), MAX(idx) FROM EpcMovement GROUP BY storeId, productId, id




