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
    homeY FLOAT DEFAULT 0
);

CREATE INDEX test2 ON EpcMoveCombined (id, idx, lastX, lastY);
CREATE INDEX test23 ON EpcMoveCombined (id, idx, lastX, lastY, storeId);

CREATE INDEX temp_me_god ON EpcMovement (id, productId, storeId, regionId, ts, x, y, confidence);



DROP TABLE IF EXISTS Zones;
CREATE TABLE Zones (
    productId VARCHAR(40) NOT NULL,
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
    percentInZone FLOAT DEFAULT 0
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








DROP TABLE IF EXISTS LastCord;



START TRANSACTION;
INSERT INTO EpcMoveCombined (id, productId, storeId, regionId, ts, x, y, confidence) SELECT id, productId, storeId, regionId, ts, x, y, confidence FROM EpcMovement ORDER BY id, ts;
INSERT INTO LastCord (idx, x, y, id, storeId) SELECT idx, x, y, id, storeId FROM EpcMoveCombined ORDER BY idx;
UPDATE LastCord SET lastIdx = idx + 1;
UPDATE EpcMoveCombined t1 INNER JOIN LastCord t2 ON t1.idx = t2.lastIdx AND t1.id=t2.id AND t1.storeId=t2.storeId SET t1.lastX=t2.x, t1.lastY=t2.y;
UPDATE EpcMoveCombined SET dLast = SQRT((x - lastX)*(x - lastX) + (y - lastY)*(y - lastY));
COMMIT;
