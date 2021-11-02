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

CREATE TABLE TestProducts (
	sku varchar(20) NULL,
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
	total int NOT NULL DEFAULT 0
);

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
	idx INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	id VARCHAR(30),
	productId VARCHAR(40),
	storeId VARCHAR(40),
	storeName VARCHAR(250),
	regionId VARCHAR(40),
	regionName VARCHAR(250),
	ts DATETIME,
	soldTimestamp DATETIME,
	x FLOAT DEFAULT 0,
	y FLOAT DEFAULT 0,
	z FLOAT DEFAULT 0,
	confidence FLOAT DEFAULT 0,
	isDeleted INTEGER DEFAULT 0,
	isDeparture INTEGER DEFAULT 0,
	isExit INTEGER DEFAULT 0,
	isGhost INTEGER DEFAULT 0,
	isMissing INTEGER DEFAULT 0,
	isMove INTEGER DEFAULT 0,
	isReacquired INTEGER DEFAULT 0,
	isRegion INTEGER DEFAULT 0,
	isSold INTEGER DEFAULT 0,
	isValid INTEGER DEFAULT 0,
	yyyy INTEGER,
	mm INTEGER,
	dd INTEGER
);

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
