UPDATE EpcMovement SET isExit=1 WHERE isExit>1;
UPDATE EpcMovement SET isGhost=1 WHERE isGhost>1;
UPDATE EpcMovement SET isMissing=1 WHERE isMissing>1;
UPDATE EpcMovement SET isMove=1 WHERE isMove>1;
UPDATE EpcMovement SET isReacquired=1 WHERE isReacquired>1;
UPDATE EpcMovement SET isMove=1 WHERE isMove>1;
UPDATE EpcMovement SET isValid=1 WHERE isValid>1;

UPDATE EpcMovement t1 INNER JOIN Sales t2 ON t1.id = t2.id AND t1.storeId=t2.storeId SET t1.soldTimestamp=t2.soldTimestamp;

UPDATE EpcMovement SET isSold=1 WHERE ts>DATE_ADD(soldTimestamp, INTERVAL -3 HOUR);

DELETE FROM EpcMovement WHERE productId IN ('9999999', '8888888');



--DELETE FROM EpcMovement WHERE productId NOT IN (SELECT sku FROM Products);

--DELETE FROM EpcMovement WHERE id NOT IN (SELECT id FROM ValidEpc);

DROP TABLE IF EXISTS ValidEpc_Bak;

CREATE TABLE ValidEpc_Bak (	id VARCHAR(30) NOT NULL, ts DATETIME NOT NULL, productId VARCHAR(40) NOT NULL, storeId VARCHAR(40) NOT NULL, PRIMARY KEY (id, productId, storeId, ts));

INSERT INTO ValidEpc_Bak (id, productId, storeId, ts) SELECT e.id, e.productId, e.storeId, MAX(e.ts) FROM EpcMovement e JOIN Products p ON e.productId=p.sku GROUP BY e.id, e.productId, e.storeId;

DROP TABLE IF EXISTS ValidEpc;

RENAME TABLE ValidEpc_Bak TO ValidEpc;

DROP TABLE IF EXISTS AllStyle_Bak;

CREATE TABLE AllStyle_Bak (storeId VARCHAR(40),deptCode VARCHAR(50), deptName VARCHAR(100),  subDeptCode varchar(50) NULL, subDeptName varchar(100) NULL, classCode varchar(50) NULL, className varchar(100) NULL, subClassCode varchar(50) NULL, subClassName varchar(100) NULL, styleCode varchar(50) NULL, styleName varchar(100) NULL, total INTEGER DEFAULT 0 );

INSERT INTO AllStyle_Bak (storeId, deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName, styleCode, styleName, total) SELECT  x.storeId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, p.subClassCode, p.subClassName, p.styleCode, p.styleName, COUNT(*)  FROM ValidEpc x JOIN Products p ON x.productId=p.sku GROUP BY x.storeId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, p.subClassCode, p.subClassName, p.styleCode, p.styleName;

DROP TABLE IF EXISTS AllStyle;

RENAME TABLE AllStyle_Bak TO AllStyle;



ALTER TABLE EpcMovement ADD homeX FLOAT DEFAULT 0;
DESC Zones;
ALTER TABLE EpcMovement ADD homeY FLOAT DEFAULT 0;
CREATE INDEX dog ON EpcMovement(id, productId);
CREATE INDEX dog2 ON EpcMovement(id, productId, homeX, homeY);
CREATE INDEX dogZ ON Zones (k, isHome, productId);
UPDATE EpcMovement t1 INNER JOIN Zones t2 ON t1.productId=t2.productId AND t2.k=2 AND t2.isHome=1 SET t1.homeX=t2.xCenter, t1.homeY=t2.yCenter;


UPDATE EpcMovement SET dHome = SQRT((x - homeX)*(x - homeX) + (y - homeY)*(y - homeY)) WHERE homeX>0 AND homeY>0;









CREATE TABLE EpcMovement_Test (
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
	h INTEGER,
	m INTEGER,
	lastX FLOAT DEFAULT 0,
	lastY FLOAT DEFAULT 0,
	dLast FLOAT DEFAULT 0,
	dHome FLOAT DEFAULT 0,
	isUpdated INTEGER DEFAULT 0,
	PRIMARY KEY (id, productId, storeId, regionId, x, y, yyyy, mm, dd, h, m)
);

INSERT INTO EpcMovement_Test (id, productId, storeId, regionId, x, y, z, ts, confidence, isDeleted, isDeparture, isExit, isGhost, isMissing, isMove, isReacquired, isRegion, isSold, isValid, yyyy, mm, dd, h, m ) SELECT id, productId, storeId, regionId, x, y, z, MAX(ts), MAX(confidence), MAX(isDeleted), MAX(isDeparture), MAX(isExit), MAX(isGhost), MAX(isMissing), MAX(isMove), MAX(isReacquired), MAX(isRegion), MAX(isSold), MAX(isValid), YEAR(ts), MONTH(ts), DAY(ts), HOUR(ts), MINUTE(ts) FROM EpcMovement GROUP BY id, productId, storeId, regionId, x, y, z, YEAR(ts), MONTH(ts), DAY(ts), HOUR(ts), MINUTE(ts);

