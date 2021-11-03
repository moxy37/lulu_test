CREATE INDEX EpcMovement_id_productId_storeId ON EpcMovement (id, productId, storeId);

DROP VIEW IF EXISTS AllDept;
CREATE VIEW AllDept AS SELECT storeId, deptCode, deptName, SUM(total) AS total FROM AllStyle GROUP BY storeId, deptCode, deptName;

DROP VIEW IF EXISTS AllSubDept;
CREATE VIEW AllSubDept AS SELECT storeId, deptCode, deptName, subDeptCode, subDeptName, SUM(total) AS total FROM AllStyle GROUP BY storeId, deptCode, deptName, subDeptCode, subDeptName;

DROP VIEW IF EXISTS AllClass;
CREATE VIEW AllClass AS SELECT storeId, deptCode, deptName, subDeptCode, subDeptName, classCode, className, SUM(total) AS total FROM AllStyle GROUP BY storeId, deptCode, deptName, subDeptCode, subDeptName, classCode, className;

DROP VIEW IF EXISTS AllSubClass;
CREATE VIEW AllSubClass AS SELECT storeId, deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName, SUM(total) AS total FROM AllStyle GROUP BY storeId, deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName;

DROP VIEW IF EXISTS EpcMovementView;
CREATE VIEW EpcMovementView AS SELECT m.storeId, m.regionId, m.regionName, m.storeName, m.id, m.idx, m.productId, m.x, m.y, m.z, m.confidence, m.ts, m.yyyy, m.mm, m.dd, m.isDeleted, m.isDeparture, m.isExit, m.isGhost, m.isMissing, m.isMove, m.isReacquired, m.isRegion, m.isSold, m.isValid, p.styleName, m.reg FROM EpcMovement m JOIN EpcReport p ON m.productId=p.productId;

DROP VIEW IF EXISTS CurrentLocation;
CREATE VIEW CurrentLocation AS SELECT m.storeId, m.id, m.productId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCOde, p.className, p.subClassCode, p.subClassName, p.styleCode, p.styleName, m.x, m.y, m.z, m.confidence, m.ts, m.regionId, m.regionName FROM EpcMovement m JOIN Products p ON m.productId=p.sku JOIN ValidEpc cl ON cl.idx=m.idx;

DROP VIEW IF EXISTS EpcMoveView;
CREATE VIEW EpcMoveView AS SELECT m.storeId, m.id, m.productId, p.deptCode, p.deptName, p.subDeptCode, p.subDeptName, p.classCOde, p.className, p.subClassCode, p.subClassName, p.styleCode, p.styleName, m.x, m.y, m.z, m.confidence, m.ts, m.regionId, m.regionName FROM EpcMovement m JOIN Products p ON m.productId=p.sku ; 

DROP VIEW IF EXISTS MomentsView;
CREATE VIEW MomentsView AS SELECT m.id, m.productId, m.storeId, m.x, m.y, m.z, m.confidence, m.ts, m.yyyy, m.mm, m.dd, m.isDeleted, m.isDeparture, m.isExit, m.isGhost, m.isMissing, m.isMove, m.isReacquired, m.isRegion, m.isSold, m.isValid, p.styleName, m.regionName FROM EpcMovement m JOIN EpcMoments p ON m.id=p.id AND m.yyyy=p.yyyy AND m.mm=p.mm AND m.dd=p.dd;

DROP VIEW IF EXISTS LastPull;
CREATE VIEW LastPull AS SELECT storeId, MAX(ts) AS ts FROM EpcMovement GROUP BY storeId;