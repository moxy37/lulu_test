CREATE INDEX EpcMovement_id_productId_storeId ON EpcMovement (id, productId, storeId);



DROP VIEW IF EXISTS AllDept;
CREATE VIEW AllDept AS SELECT p.deptCode, p.deptName, COUNT(*) AS total, x.storeId  FROM ValidEpc x JOIN Products p ON x.productId=p.sku GROUP BY x.storeId, p.deptCode, p.deptName;

DROP VIEW IF EXISTS AllSubDept;
CREATE VIEW AllSubDept AS SELECT p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, COUNT(*) AS total, x.storeId  FROM ValidEpc x JOIN Products p ON x.productId=p.sku GROUP BY x.storeId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName;

DROP VIEW IF EXISTS AllClass;
CREATE VIEW AllClass AS SELECT p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, COUNT(*) AS total, x.storeId  FROM ValidEpc x JOIN Products p ON x.productId=p.sku GROUP BY x.storeId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className;

DROP VIEW IF EXISTS AllSubClass;
CREATE VIEW AllSubClass AS SELECT p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, p.subClassCode, p.subClassName, COUNT(*) AS total, x.storeId  FROM ValidEpc x JOIN Products p ON x.productId=p.sku GROUP BY x.storeId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, p.subClassCode, p.subClassName;

DROP VIEW IF EXISTS AllStyle;
CREATE VIEW AllStyle AS SELECT p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, p.subClassCode, p.subClassName, p.styleCode, p.styleName, COUNT(*) AS total, x.storeId  FROM ValidEpc x JOIN Products p ON x.productId=p.sku GROUP BY x.storeId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCode, p.className, p.subClassCode, p.subClassName, p.styleCode, p.styleName;

DROP VIEW IF EXISTS EpcMovementView;
CREATE VIEW EpcMovementView AS SELECT m.storeId, m.regionId, m.regionName, m.storeName, m.id, m.idx, m.productId, m.x, m.y, m.z, m.confidence, m.ts, m.yyyy, m.mm, m.dd, m.isDeleted, m.isDeparture, m.isExit, m.isGhost, m.isMissing, m.isMove, m.isReacquired, m.isRegion, m.isSold, m.isValid, p.styleName FROM EpcMovement m JOIN EpcReport p ON m.productId=p.productId;

DROP VIEW IF EXISTS CurrentLocation;
CREATE VIEW CurrentLocation AS SELECT m.id, m.productId, p.styleName, m.x, m.y, m.z, m.confidence, m.ts, m.yyyy, m.mm, m.dd, m.isDeleted, m.isDeparture, m.isExit, m.isGhost, m.isMissing, m.isMove, m.isReacquired, m.isRegion, m.isSold, m.isValid FROM EpcMovement m JOIN EpcReport p ON m.productId=p.productId JOIN LastRead cl ON cl.idx=m.idx;



LastRead cl JOIN EpcMovement m ON cl.idx=m.idx JOIN Products p ON m.productId=p.sku;