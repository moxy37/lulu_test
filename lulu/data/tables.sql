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

CREATE TABLE Sales (
	id VARCHAR(30) NOT NULL,
	soldTimestamp DATETIME,
	isSale INTEGER DEFAULT 0,
	reason VARCHAR(250),
	PRIMARY KEY (id, soldTimestamp, isSale)
);

DROP TABLE IF EXISTS EpcMovement;
CREATE TABLE EpcMovement (
	id VARCHAR(30),
	productId VARCHAR(40),
	storeId VARCHAR(40),
	storeName VARCHAR(250),
	regionId VARCHAR(40),
	regionName VARCHAR(250),
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
	price FLOAT DEFAULT 0,
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

