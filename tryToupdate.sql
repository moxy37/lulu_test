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

CREATE TABLE TempMe (
	id VARCHAR(30),
	productId VARCHAR(20),
	yyyy INTEGER,
	mm INTEGER, 
	dd INTEGER,
	h INTEGER,
	m INTEGER,
	ts DATETIME, 
	soldTimestamp DATETIME
);

INSERT INTO TempMe (id, productId, yyyy, mm, dd, h, m, ts, soldTimestamp) SELECT EpcMovement.id, EpcMovement.productId, EpcMovement.yyyy, EpcMovement.mm, EpcMovement.dd, EpcMovement.h, EpcMovement.m, EpcMovement.ts, Sales.soldTimestamp FROM EpcMovement JOIN Sales ON EpcMovement.id=Sales.id;

UPDATE TempMe SET ts=DATE_ADD(ts, INTERVAL -3 HOUR), soldTimestamp=DATE_ADD(soldTimestamp, INTERVAL 7 HOUR);

DELETE FROM TempMe WHERE ts<soldTimestamp;

UPDATE EpcMovement INNER JOIN TempMe ON EpcMovement.yyyy=TempMe.yyyy AND EpcMovement.mm=TempMe.mm AND EpcMovement.dd=TempMe.dd AND EpcMovement.h=TempMe.h AND EpcMovement.m=TempMe.m SET isSold=1;

DROP TABLE IF EXISTS TempMe;
CREATE TABLE TempMe (
	id VARCHAR(30),
	yyyy INTEGER,
	mm INTEGER, 
	dd INTEGER,
	h INTEGER,
	total INTEGER,
	allReads INTEGER,
	regionCount INTEGER,
	maxTS DATETIME
);
SELECT regionCount, total, COUNT(*) AS tags, AVG(allReads) FROM TempMe GROUP BY regionCount, total ORDER BY regionCount, total;

INSERT INTO TempMe (id, yyyy, mm, dd, h, total, allReads, regionCount, maxTS) SELECT id, yyyy, mm, dd, h, COUNT(*), SUM(dailyMoves), COUNT(DISTINCT(regionId)), MAX(ts) FROM EpcMovement GROUP BY id, yyyy, mm, dd, h;

SELECT SUM(isUpdated), SUM(isDeleted) FROM EpcMovement;

DROP TABLE IF EXISTS SetUpDelete;
CREATE TABLE SetUpDelete (
	id VARCHAR(30),
	yyyy INTEGER,
	mm INTEGER, 
	dd INTEGER,
	h INTEGER,
	m INTEGER,
	regionId VARCHAR(40)
);




DROP TABLE IF EXISTS ToDelete;
CREATE TABLE ToDelete (
	id VARCHAR(30),
	yyyy INTEGER,
	mm INTEGER, 
	dd INTEGER,
	h INTEGER,
	x FLOAT,
	y FLOAT
);


INSERT INTO ToDelete (id, yyyy, mm, dd, h, x, y) SELECT id, yyyy, mm, dd, h, AVG(x), AVG(y) FROM EpcMovement WHERE isDeleted=1 GROUP BY id, yyyy, mm, dd, h;

DELETE FROM EpcMovement WHERE isDeleted=1 AND isUpdated=0;



SELECT COUNT(*) FROM EpcMovement WHERE isUpdated=1 AND isDeleted=1;

UPDATE EpcMovement INNER JOIN ToDelete ON EpcMovement.id=ToDelete.id AND EpcMovement.yyyy=ToDelete.yyyy AND EpcMovement.mm=ToDelete.mm AND EpcMovement.dd=ToDelete.dd AND EpcMovement.h=ToDelete.h SET EpcMovement.x=ToDelete.x, EpcMovement.y=ToDelete.y;

UPDATE EpcMovement SET isDeleted=0, isUpdated=0;

)  AS x GROUP BY x.total ORDER BY x.total;

SELECT COUNT(*) FROM TempMe WHERE allReads>20;

SELECT regionCount, COUNT(*), AVG(allReads) FROM TempMe WHERE allReads>20 GROUP BY regionCount ORDER BY regionCount;

UPDATE EpcMovement INNER JOIN Sales ON EpcMovement.id=Sales.id SET EpcMovement.soldTimestamp = Sales.soldTimestamp;



--DELETE FROM EpcMovement WHERE productId NOT IN (SELECT sku FROM Products);

--DELETE FROM EpcMovement WHERE id NOT IN (SELECT id FROM ValidEpc);

DROP TABLE IF EXISTS ValidEpc_Bak;

CREATE TABLE ValidEpc_Bak (	id VARCHAR(30) NOT NULL, ts DATETIME NOT NULL, productId VARCHAR(40) NOT NULL, storeId VARCHAR(40) NOT NULL, PRIMARY KEY (id, productId, storeId, ts));

INSERT INTO ValidEpc_Bak (id, productId, storeId, ts) SELECT e.id, e.productId, e.storeId, MAX(e.ts) FROM EpcMovement e JOIN Products p ON e.productId=p.sku GROUP BY e.id, e.productId, e.storeId;

DROP TABLE IF EXISTS ValidEpc;

RENAME TABLE ValidEpc_Bak TO ValidEpc;

DROP TABLE IF EXISTS AllStyle_Bak;

CREATE TABLE AllStyle (storeId VARCHAR(40),deptCode VARCHAR(50), deptName VARCHAR(100),  subDeptCode varchar(50) NULL, subDeptName varchar(100) NULL, classCode varchar(50) NULL, className varchar(100) NULL, subClassCode varchar(50) NULL, subClassName varchar(100) NULL, styleCode varchar(50) NULL, styleName varchar(100) NULL, total INTEGER DEFAULT 0 );

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





SELECT DATE_ADD(NOW(), INTERVAL -3 HOUR);

