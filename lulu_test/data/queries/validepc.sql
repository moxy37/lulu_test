eDROP TABLE IF EXISTS ValidEpc_Bak;

CREATE TABLE ValidEpc_Bak (	id VARCHAR(30) NOT NULL, ts DATETIME NOT NULL, productId VARCHAR(40) NOT NULL, storeId VARCHAR(40) NOT NULL, PRIMARY KEY (id, productId, storeId, ts));

INSERT INTO ValidEpc_Bak (id, productId, storeId, ts) SELECT e.id, e.productId, e.storeId, MAX(e.ts) FROM EpcMovement e JOIN Products p ON e.productId=p.sku GROUP BY e.id, e.productId, e.storeId ;

DROP TABLE IF EXISTS ValidEpc;

RENAME TABLE ValidEpc_Bak TO ValidEpc;

DROP TABLE IF EXISTS AllStyle_Bak;

CREATE TABLE AllStyle_Bak (storeId VARCHAR(40),deptCode VARCHAR(50), deptName VARCHAR(100),  subDeptCode varchar(50) NULL, subDeptName varchar(100) NULL, classCode varchar(50) NULL, className varchar(100) NULL, subClassCode varchar(50) NULL, subClassName varchar(100) NULL, styleCode varchar(50) NULL, styleName varchar(100) NULL, total INTEGER DEFAULT 0 );


INSERT INTO AllStyle_Bak (storeId, deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName, styleCode, styleName, total) SELECT  x.storeId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, p.subClassCode, p.subClassName, p.styleCode, p.styleName, COUNT(*)  FROM ValidEpc x JOIN Products p ON x.productId=p.sku GROUP BY x.storeId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, p.subClassCode, p.subClassName, p.styleCode, p.styleName;

DROP TABLE IF EXISTS AllStyle;

RENAME TABLE AllStyle_Bak TO AllStyle;
