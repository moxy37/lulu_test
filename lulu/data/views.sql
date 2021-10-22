

CREATE VIEW AllDept AS SELECT deptCode, deptName, COUNT(*) AS total FROM Products GROUP BY deptCode, deptName;
CREATE VIEW AllSubDept AS SELECT deptCode, deptName, subDeptCode, subDeptName, COUNT(*) AS total FROM Products GROUP BY deptCode, deptName, subDeptCode, subDeptName;
CREATE VIEW AllClass AS SELECT deptCode, deptName, subDeptCode, subDeptName, classCode, className, COUNT(*) AS total FROM Products GROUP BY deptCode, deptName, subDeptCode, subDeptName, classCode, className;
CREATE VIEW AllSubClass AS SELECT deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName, COUNT(*) AS total FROM Products GROUP BY deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName;
CREATE VIEW AllStyle AS SELECT deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName, styleCode, styleName, COUNT(*) AS total FROM Products GROUP BY deptCode, deptName, subDeptCode, subDeptName, classCode, className, subClassCode, subClassName, styleCode, styleName;
