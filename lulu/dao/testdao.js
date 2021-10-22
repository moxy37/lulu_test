var con = require(__base + 'dbConnection');
var async = require('async');
var uuid = require("node-uuid");

module.exports = TestDAO;

function TestDAO() {
    this.upc = function (deptId, subDeptId, classId, subClassId, styleId, year, month, day, table, limit, next) {
        var sql = "SELECT productId, styleName, COUNT(*) AS total FROM " + table + " WHERE yyyy=? AND mm=? AND dd=? AND styleName IS NOT NULL ";
        var parmList = [];
        parmList.push(year);
        parmList.push(month);
        parmList.push(day);
        if (deptId !== undefined) {
            sql += "AND deptCode=? ";
            parmList.push(deptId);
        }
        if (subDeptId !== undefined) {
            sql += "AND subDeptCode=? ";
            parmList.push(subDeptId);
        }
        if (classId !== undefined) {
            sql += "AND classCode=? ";
            parmList.push(classId);
        }
        if (subClassId !== undefined) {
            sql += "AND subClassCode=? ";
            parmList.push(subClassId);
        }
        if (styleId !== undefined) {
            sql += "AND styleCode=? ";
            parmList.push(styleId);
        }
        sql += "GROUP BY productId,  styleName ORDER BY styleName ";
        // if (limit !== undefined) {
        //     sql += "LIMIT " + limit;
        // }
        con.query(sql, parmList, function (err, results) {
            if (err) {
                console.log(err.message);
                return next(err);
            }
            var list = [];
            async.forEach(results, function (r, callback) {
                var o = new Object();
                o.productId = r.productId;
                o.name = r.Name;
                o.total = r.total;
                list.push(o);
                callback();
            }, function (err) {
                return next(null, list);
            });
        });
    }

    this.allDept = function (next) {
        var sql = "SELECT * FROM AllDept";
        con.query(sql, function (err, results) {
            if (err) {
                console.log(err.message);
                return next(err);
            }
            var list = [];
            async.forEach(results, function (r, callback) {
                var o = new Object();
                o.dept = r.deptCode;
                o.deptName = r.deptName;
                o.total = r.total;
                list.push(o);
                callback();
            }, function (err) {
                return next(null, list);
            });
        });
    }

    this.subDept = function (id, next) {
        var sql = "SELECT * FROM AllSubDept WHERE deptCode=?";
        con.query(sql, id, function (err, results) {
            if (err) {
                console.log(err.message);
                return next(err);
            }
            var list = [];
            async.forEach(results, function (r, callback) {
                var o = new Object();
                o.dept = r.deptCode;
                o.deptName = r.deptName;
                o.subDept = r.subDept;
                o.subDeptName = r.subDeptName;
                o.total = r.total;
                list.push(o);
                callback();
            }, function (err) {
                return next(null, list);
            });
        });
    }

    this.classes = function (deptId, subDeptId, next) {
        var sql = "SELECT * FROM AllClass WHERE deptCode=? AND subDeptCode=?";
        con.query(sql, [deptId, subDeptId], function (err, results) {
            if (err) {
                console.log(err.message);
                return next(err);
            }
            var list = [];
            async.forEach(results, function (r, callback) {
                var o = new Object();
                o.dept = r.deptCode;
                o.deptName = r.deptName;
                o.subDept = r.subDeptCode;
                o.subDeptName = r.subDeptName;
                o.class = r.classCode;
                o.className = r.className;
                o.total = r.total;
                list.push(o);
                callback();
            }, function (err) {
                return next(null, list);
            });
        });
    }

    this.subClasses = function (deptId, subDeptId, classId, next) {
        var sql = "SELECT * FROM AllSubClass WHERE deptCode=? AND subDeptCode=? AND classCode=?";
        con.query(sql, [deptId, subDeptId, classId], function (err, results) {
            if (err) {
                console.log(err.message);
                return next(err);
            }
            var list = [];
            async.forEach(results, function (r, callback) {
                var o = new Object();
                o.dept = r.deptCode;
                o.deptName = r.deptName;
                o.subDept = r.subDeptCode;
                o.subDeptName = r.subDeptName;
                o.class = r.classCode;
                o.className = r.className;
                o.subClass = r.subClassCode;
                o.subClassName = r.subClassName;
                o.total = r.total;
                list.push(o);
                callback();
            }, function (err) {
                return next(null, list);
            });
        });
    }

    this.style = function (deptId, subDeptId, classId, subClassId, next) {
        var sql = "SELECT * FROM AllStyle WHERE deptCode=? AND subDeptCode=? AND classCode=? AND subClassCode=?";
        con.query(sql, [deptId, subDeptId, classId, subClassId], function (err, results) {
            if (err) {
                console.log(err.message);
                return next(err);
            }
            var list = [];
            async.forEach(results, function (r, callback) {
                var o = new Object();
                o.dept = r.deptCode;
                o.deptName = r.deptName;
                o.subDept = r.subDeptCode;
                o.subDeptName = r.subDeptName;
                o.class = r.classCode;
                o.className = r.className;
                o.subClass = r.subClassCode;
                o.subClassName = r.subClassName;
                o.style = r.styleCode;
                o.styleName = r.styleName;
                o.total = r.total;
                list.push(o);
                callback();
            }, function (err) {
                return next(null, list);
            });
        });
    }

    this.points = function (deptId, subDeptId, classId, subClassId, styleId, year, month, day, productId, table, limit, next) {
        var sql = "SELECT * FROM " + table + " WHERE yyyy=? AND mm=? AND dd=? AND styleName IS NOT NULL ";
        var parmList = [];
        parmList.push(year);
        parmList.push(month);
        parmList.push(day);
        if (deptId !== undefined) {
            sql += "AND deptCode=? ";
            parmList.push(deptId);
        }
        if (subDeptId !== undefined) {
            sql += "AND subDeptCode=? ";
            parmList.push(subDeptId);
        }
        if (classId !== undefined) {
            sql += "AND classCode=? ";
            parmList.push(classId);
        }
        if (subClassId !== undefined) {
            sql += "AND subClassCode=? ";
            parmList.push(subClassId);
        }
        if (styleId !== undefined) {
            sql += "AND styleCode=? ";
            parmList.push(styleId);
        }
        if (productId !== undefined && productId.length > 0) {
            sql += "AND productId IN (";
            for (var i = 0; i < productId.length; i++) {
                if (i > 0) { sql += ", "; }
                sql += "?";
                parmList.push(productId[i]);
            }
            sql += ") ";
        }
        sql += "ORDER BY styleName, ts ";
        // if (limit !== undefined) {
        //     sql += "LIMIT " + limit;
        // }
        con.query(sql, parmList, function (err, results) {
            if (err) {
                console.log(err.message);
                return next(err);
            }
            var list = [];
            var obj = new Object();
            obj.list = [];
            obj.paths = new Object();
            var lastId = '';
            async.forEach(results, function (r, callback) {
                if (r.id !== lastId) {
                    lastId = r.id;
                    obj.paths[r.id] = [];
                }
                var o = new Object();
                o.dept = r.deptCode;
                o.deptName = r.deptName;
                o.subDept = r.subDeptCode;
                o.subDeptName = r.subDeptName;
                o.class = r.classCode;
                o.className = r.ClassName;
                o.subClass = r.subClassCode;
                o.subClassName = r.subClassName;
                o.x = r.x;
                o.y = r.y;
                o.z = r.z;
                o.confidence = r.confidence;
                o.timestamp = r.ts;
                o.id = r.id;
                o.productId = r.productId;
                o.style = r.styleCode;
                o.styleName = r.styleName;
                obj.paths[r.id].push(o);
                obj.list.push(o);
                callback();
            }, function (err) {
                return next(null, obj);
            });
        });
    }

}