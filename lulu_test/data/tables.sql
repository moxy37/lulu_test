CREATE TABLE TestProducts (
	sku varchar(20) NOT NULL,
	deptCode varchar(50) NULL,
	deptName varchar(100) NULL,
	subDeptCode varchar(50) NULL,
	subDeptName varchar(100) NULL,
	classCode varchar(50) NULL,
	className varchar(100) NULL,
	subClassCode varchar(50) NULL,
	subClassName varchar(100) NULL,
	styleCode varchar(50) NULL,
	styleName varchar(100) NULL,
	price float NOT NULL DEFAULT 0,
	store varchar(10) NOT NULL DEFAULT '',
	total int NOT NULL DEFAULT 0,
	PRIMARY KEY(sku, store)
);

DROP TABLE IF EXISTS RegionBoundaries;	
CREATE TABLE RegionBoundaries (
	region varchar(40) NOT NULL,
	x float NULL,
	y float NULL
); 

DROP TABLE IF EXISTS Regions;
CREATE TABLE Regions (
	id varchar(40) PRIMARY KEY,
	regionName varchar(50) NULL,
	xHome float DEFAULT 0,
	yHome float DEFAULT 0,
	storeId VARCHAR(40)
);



DROP TABLE IF EXISTS Products;
CREATE TABLE Products (
	sku varchar(20) PRIMARY KEY,
	deptCode varchar(50) NULL,
	deptName varchar(100) NULL,
	subDeptCode varchar(50) NULL,
	subDeptName varchar(100) NULL,
	classCode varchar(50) NULL,
	className varchar(100) NULL,
	subClassCode varchar(50) NULL,
	subClassName varchar(100) NULL,
	styleCode varchar(50) NULL,
	styleName varchar(100) NULL,
	price float NOT NULL DEFAULT 0
);

DROP TABLE IF EXISTS Stores;
CREATE TABLE Stores (
	id VARCHAR(40) PRIMARY KEY,
	storeName VARCHAR(100),
	storeNumber INTEGER
);

DROP TABLE IF EXISTS Sales;
CREATE TABLE Sales (
	id VARCHAR(30) NOT NULL,
	productId varchar(20),
	soldTimestamp DATETIME,
	transactionType VARCHAR(20),
	storeId VARCHAR(40) NOT NULL
);

DROP TABLE IF EXISTS EpcMovement;
CREATE TABLE EpcMovement (
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
	PRIMARY KEY (id, productId, storeId, regionId, ts, x, y)
);

INSERT INTO EpcMovement (id, productId, storeId, ts, regionId, x, y) VALUES ('', '9999999','1597647a-7056-3fe9-94c1-ae5c9d16d69b','2021-12-1 01:01:00', '', 0, 0);

INSERT INTO EpcMovement (id, productId, storeId, ts, regionId, x, y) VALUES ('', '9999999','d4f87b6f-5199-43ac-b231-fbe6e3a8039c','2022-1-1 01:01:00', '', 0, 0);

DROP TABLE IF EXISTS Moments;
CREATE TABLE Moments (
	id VARCHAR(40) NOT NULL,
	storeId VARCHAR(40) NOT NULL,
	itemId VARCHAR(30) NOT NULL,
	productId VARCHAR(40),
	originRegionId VARCHAR(40),
	regionId VARCHAR(40),
	ts DATETIME,
	isFlag INTEGER DEFAULT 0,
	PRIMARY KEY (id, storeId, itemId)
);

DROP TABLE IF EXISTS ValidEpc;
CREATE TABLE ValidEpc (
	id VARCHAR(30) NOT NULL,
	ts DATETIME NOT NULL,
	productId VARCHAR(40) NOT NULL,
	storeId VARCHAR(40) NOT NULL,
	PRIMARY KEY (id, productId, storeId)
);
--CREATE INDEX valid_1 ON ValidEpc(id, productId);
--CREATE INDEX valid_2 ON ValidEpc(id, productId, storeId);

DROP TABLE IF EXISTS EpcMoments;
CREATE TABLE EpcMoments (
	id VARCHAR(30) NOT NULL,
	productId VARCHAR(40) NOT NULL,
	storeId VARCHAR(40) NOT NULL,
	styleName VARCHAR(100),
	yyyy INTEGER,
	mm INTEGER,
	dd INTEGER
);

INSERT INTO EpcMoments (id, productId, storeId, styleName, yyyy, mm, dd) SELECT m.itemId, m.productId, m.storeId, p.styleName, YEAR(m.ts), MONTH(m.ts), DAY(m.ts) FROM Moments m JOIN Products p ON m.productId=p.sku WHERE m.isFlag=0;

DROP TABLE IF EXISTS EpcReport;
CREATE TABLE EpcReport (
	productId VARCHAR(40) NOT NULL,
	styleName VARCHAR(100)
);

CREATE TABLE Products_bak (
	sku varchar(20),
	deptCode varchar(50) NULL,
	deptName varchar(100) NULL,
	subDeptCode varchar(50) NULL,
	subDeptName varchar(100) NULL,
	classCode varchar(50) NULL,
	className varchar(100) NULL,
	subClassCode varchar(50) NULL,
	subClassName varchar(100) NULL,
	styleCode varchar(50) NULL,
	styleName varchar(100) NULL,
	price float NOT NULL DEFAULT 0
);

DROP TABLE IF EXISTS ValidSku;
CREATE TABLE ValidSku (productId VARCHAR(20), storeId VARCHAR(40), total INTEGER DEFAULT 0);
INSERT INTO ValidSku (productId, storeId, total) SELECT productId, storeId, COUNT(*) FROM ValidEpc GROUP BY storeId, productId;

INSERT INTO Products_bak (sku, deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName, styleCode, styleName, price) SELECT sku, deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName, styleCode, styleName, price FROM Products;