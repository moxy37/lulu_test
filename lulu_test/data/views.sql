
DROP VIEW IF EXISTS AllDept;
DROP VIEW IF EXISTS AllSubDept;
DROP VIEW IF EXISTS AllClass;
DROP VIEW IF EXISTS AllSubClass;
DROP VIEW IF EXISTS AllStyle;

CREATE VIEW AllDept AS SELECT deptCode, deptName, COUNT(*) AS total FROM EpcMovement GROUP BY deptCode, deptName;
CREATE VIEW AllSubDept AS SELECT deptCode, deptName, subDeptCode, subDeptName, COUNT(*) AS total FROM EpcMovement GROUP BY deptCode, deptName, subDeptCode, subDeptName;
CREATE VIEW AllClass AS SELECT deptCode, deptName, subDeptCode, subDeptName, classCode, className, COUNT(*) AS total FROM EpcMovement GROUP BY deptCode, deptName, subDeptCode, subDeptName, classCode, className;
CREATE VIEW AllSubClass AS SELECT deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName, COUNT(*) AS total FROM EpcMovement GROUP BY deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName;
CREATE VIEW AllStyle AS SELECT deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName, styleCode, styleName, COUNT(*) AS total FROM EpcMovement GROUP BY deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName, styleCode, styleName;

DROP VIEW IF EXISTS LastRead;
CREATE VIEW LastRead AS SELECT id, MAX(idx) AS idx FROM EpcMovement GROUP BY id ;
DROP VIEW IF EXISTS CurrentLocation;
CREATE VIEW CurrentLocation AS SELECT cl.id, m.productId, m.deptCode, m.deptName, m.subDeptCode, m.subDeptName, m.classCode, m.className, m.subClassCode, m.subClassName, m.styleCode, m.styleName, m.price, m.x, m.y, m.z, m.confidence, m.ts, m.yyyy, m.mm, m.dd FROM LastRead cl JOIN EpcMovement m ON cl.idx=m.idx;
