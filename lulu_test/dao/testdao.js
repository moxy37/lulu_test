var con = require(__base + 'dbConnection');
var async = require('async');

module.exports = TestDAO;

function TestDAO() {
    this.upc = function (storeId, deptId, subDeptId, classId, subClassId, styleId, year, month, day, table, limit, next) {
        con.query("TRUNCATE TABLE EpcReport", function (err, result) {
            var sql = "INSERT INTO EpcReport (productId, styleName) SELECT sku, styleName FROM Products ";
            var whereAdded = false;
            if (deptId !== undefined && deptId !== '') {
                if (whereAdded) {
                    sql += "AND ";
                } else {
                    sql += "WHERE ";
                    whereAdded = true;
                }
                sql += "deptCode=? ";
                parmList.push(deptId);
            }
            if (subDeptId !== undefined && subDeptId !== '') {
                if (whereAdded) {
                    sql += "AND ";
                } else {
                    sql += "WHERE ";
                    whereAdded = true;
                }
                sql += "subDeptCode=? ";
                parmList.push(subDeptId);
            }
            if (classId !== undefined && classId !== '') {
                if (whereAdded) {
                    sql += "AND ";
                } else {
                    sql += "WHERE ";
                    whereAdded = true;
                }
                sql += "classCode=? ";
                parmList.push(classId);
            }
            if (subClassId !== undefined && subClassId !== '') {
                if (whereAdded) {
                    sql += "AND ";
                } else {
                    sql += "WHERE ";
                    whereAdded = true;
                }
                sql += "subClassCode=? ";
                parmList.push(subClassId);
            }
            if (styleId !== undefined && styleId !== '') {
                if (whereAdded) {
                    sql += "AND ";
                } else {
                    sql += "WHERE ";
                    whereAdded = true;
                }
                sql += "styleCode=? ";
                parmList.push(styleId);
            }
            if (productId !== undefined && productId.length > 0) {
                if (whereAdded) {
                    sql += "AND ";
                } else {
                    sql += "WHERE ";
                    whereAdded = true;
                }
                sql += "sku IN (";
                for (var i = 0; i < productId.length; i++) {
                    if (i > 0) { sql += ", "; }
                    sql += "?";
                    parmList.push(productId[i]);
                }
                sql += ") ";
            }
            sql += "GROUP BY sku, styleName ";
            console.log(sql);
            console.log(parmList);
            con.query(sql, parmList, function (err, results) {
                if (err) {
                    console.log(err.message);
                    return next(err);
                }
                sql = "SELECT * FROM " + table + " WHERE styleName IS NOT NULL ";
                parmList = [];
                if (storeId !== undefined && storeId !== '') {
                    sql += "AND storeId=? ";
                    parmList.push(storeId);
                }
                if (year !== undefined && year !== '') {
                    sql += "AND yyyy=? ";
                    parmList.push(parseInt(year));
                }
                if (month !== undefined && month !== '') {
                    sql += "AND mm=? ";
                    parmList.push(parseInt(month));
                }
                if (day !== undefined && day !== '') {
                    sql += "AND dd=? ";
                    parmList.push(parseInt(day));
                }
                sql += "ORDER BY styleName, ts ";
                console.log(sql);
                console.log(parmList);
                con.query(sql, parmList, function (err, results) {
                    if (err) {
                        console.log(err.message);
                        return next(err);
                    }
                    var list = [];
                    async.forEach(results, function (r, callback) {
                        var o = new Object();
                        o.productId = r.productId;
                        o.name = r.styleName;
                        o.total = r.total;
                        list.push(o);
                        callback();
                    }, function (err) {
                        return next(null, list);
                    });
                });
            });
        });

    }

    this.allDept = function (storeId, next) {
        var sql = "SELECT * FROM AllDept WHERE storeId=? ORDER BY deptName";
        con.query(sql, storeId, function (err, results) {
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

    this.subDept = function (storeId, id, next) {
        var sql = "SELECT * FROM AllSubDept WHERE deptCode=? AND storeId=? ORDER BY subDeptName";
        con.query(sql, [id, storeId], function (err, results) {
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
                o.total = r.total;
                list.push(o);
                callback();
            }, function (err) {
                return next(null, list);
            });
        });
    }

    this.classes = function (storeId, deptId, subDeptId, next) {
        var sql = "SELECT * FROM AllClass WHERE deptCode=? AND subDeptCode=? AND storeId=? ";
        con.query(sql, [deptId, subDeptId, storeId], function (err, results) {
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

    this.subClasses = function (storeId, deptId, subDeptId, classId, next) {
        var sql = "SELECT * FROM AllSubClass WHERE deptCode=? AND subDeptCode=? AND classCode=? AND storeId=? ORDER BY subClassName";
        con.query(sql, [deptId, subDeptId, classId, storeId], function (err, results) {
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

    this.style = function (storeId, deptId, subDeptId, classId, subClassId, next) {
        var sql = "SELECT * FROM AllStyle WHERE deptCode=? AND subDeptCode=? AND classCode=? AND subClassCode=? AND storeId=? ORDER BY styleName";
        con.query(sql, [deptId, subDeptId, classId, subClassId, storeId], function (err, results) {
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

    this.points = function (storeId, deptId, subDeptId, classId, subClassId, styleId, year, month, day, productId, isExit, isGhost, isMissing, isMove, isRegion, isValid, table, limit, next) {
        if (table === 'Moments') {
            sql = "SELECT * FROM MomentsView WHERE styleName IS NOT NULL ";
            parmList = [];
            if (storeId !== undefined && storeId !== '') {
                sql += "AND storeId=? ";
                parmList.push(storeId);
            }

            if (year !== undefined && year !== '') {
                sql += "AND yyyy=? ";
                parmList.push(parseInt(year));
            }
            if (month !== undefined && month !== '') {
                sql += "AND mm=? ";
                parmList.push(parseInt(month));
            }
            if (day !== undefined && day !== '') {
                sql += "AND dd=? ";
                parmList.push(parseInt(day));
            }

            sql += "ORDER BY styleName, ts ";
            console.log(sql);
            console.log(parmList);
            con.query(sql, parmList, function (err, results) {
                if (err) {
                    console.log(err.message);
                    return next(err);
                }
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
                    o.x = r.x;
                    o.y = r.y;
                    o.z = r.z;
                    o.confidence = r.confidence;
                    o.timestamp = r.ts;
                    o.id = r.id;
                    o.productId = r.productId;
                    o.name = r.styleName;
                    o.regionName = r.regionName;
                    o.styleName = r.styleName;
                    o.isExit = r.isExit;
                    o.isGhost = r.isGhost;
                    o.isMissing = r.isMissing;
                    o.isMove = r.isMove;
                    o.isReacquired = r.isReacquired;
                    o.isRegion = r.isRegion;
                    o.isSold = r.isSold;
                    o.isValid = r.isValid;
                    obj.paths[r.id].push(o);
                    obj.list.push(o);
                    callback();
                }, function (err) {
                    return next(null, obj);
                });
            });
        } else {
            var sql = "SELECT * FROM " + table + " WHERE styleName IS NOT NULL ";
            var whereAdded = false;
            var parmList = [];
            if (deptId !== undefined && deptId !== '') {
                sql += "AND deptCode=? ";
                parmList.push(deptId);
            }
            if (subDeptId !== undefined && subDeptId !== '') {
                sql += "AND subDeptCode=? ";
                parmList.push(subDeptId);
            }
            if (classId !== undefined && classId !== '') {
                sql += "AND classCode=? ";
                parmList.push(classId);
            }
            if (subClassId !== undefined && subClassId !== '') {
                sql += "AND subClassCode=? ";
                parmList.push(subClassId);
            }
            if (styleId !== undefined && styleId !== '') {
                sql += "AND styleCode=? ";
                parmList.push(styleId);
            }
            if (productId !== undefined && productId !== '') {
                sql += "AND productId=? ";
                parmList.push(productId);
            }
            if (storeId !== undefined && storeId !== '') {
                sql += "AND storeId=? ";
                parmList.push(storeId);
            }
            if (year !== undefined && year !== '') {
                sql += "AND yyyy=? ";
                parmList.push(parseInt(year));
            }
            if (month !== undefined && month !== '') {
                sql += "AND mm=? ";
                parmList.push(parseInt(month));
            }
            if (day !== undefined && day !== '') {
                sql += "AND dd=? ";
                parmList.push(parseInt(day));
            }
            if (isExit !== undefined) {
                sql += "AND isExit=? ";
                parmList.push(1);
            }
            if (isGhost !== undefined) {
                sql += "AND isGhost=? ";
                parmList.push(1);
            }
            if (isMissing !== undefined) {
                sql += "AND isMissing=? ";
                parmList.push(1);
            }
            if (isMove !== undefined) {
                sql += "AND isMove=? ";
                parmList.push(1);
            }
            if (isRegion !== undefined) {
                sql += "AND isRegion=? ";
                parmList.push(1);
            }
            if (isValid !== undefined) {
                sql += "AND isValid=? ";
                parmList.push(1);
            }
            sql += "ORDER BY styleName, ts ";
            console.log(sql);
            console.log(parmList);
            con.query(sql, parmList, function (err, results) {
                if (err) {
                    console.log(err.message);
                    return next(err);
                }
                var lastId = '';
                var obj = new Object();
                obj.list = [];
                obj.paths = new Object();
                async.forEach(results, function (r, callback) {
                    if (r.id !== lastId) {
                        lastId = r.id;
                        obj.paths[r.id] = [];
                    }
                    var o = new Object();
                    o.x = r.x;
                    o.y = r.y;
                    o.z = r.z;
                    o.confidence = r.confidence;
                    o.timestamp = r.ts;
                    o.id = r.id;
                    o.productId = r.productId;
                    o.name = r.styleName;
                    o.styleName = r.styleName;
                    o.regionName = r.regionName;
                    // m.isExit, m.isGhost, m.isMissing, m.isMove, m.isReacquired, m.isRegion, m.isSold, m.isValid
                    o.isExit = r.isExit;
                    o.isGhost = r.isGhost;
                    o.isMissing = r.isMissing;
                    o.isMove = r.isMove;
                    o.isReacquired = r.isReacquired;
                    o.isRegion = r.isRegion;
                    o.isSold = r.isSold;
                    o.isValid = r.isValid;
                    obj.paths[r.id].push(o);
                    obj.list.push(o);
                    callback();
                }, function (err) {
                    return next(null, obj);
                });
            });
        }
    }

}