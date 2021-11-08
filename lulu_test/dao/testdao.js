var con = require(__base + 'dbConnection');
var async = require('async');

module.exports = TestDAO;

function TestDAO() {
    this.sku = function (storeId, deptId, subDeptId, classId, subClassId, styleId, next) {
        var sql = "SELECT productId, styleName FROM CurrentLocation WHERE styleName IS NOT NULL ";
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
        if (storeId !== undefined && storeId !== '') {
            sql += "AND storeId=? ";
            parmList.push(storeId);
        }
        con.query(sql, parmList, function (err, results) {
            if (err) {
                console.log(err.message);
                return next(err);
            }
            var list = [];
            async.forEach(results, function (r, callback) {
                var o = new Object();
                o.styleName = r.styleName;
                o.productId = r.productId;
                list.push(o);
                callback();
            }, function (err) {
                return next(null, list);
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

    this.points = function (storeId, deptId, subDeptId, classId, subClassId, styleId, year, month, day, productId, id, isExit, isGhost, isMissing, isMove, isRegion, isValid, table, limit, next) {
        console.log("Starting log grab points");
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
                console.log("Starting query");
                async.forEach(results, function (r, callback) {
                    console.log("Query done now putting together");
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
                    if (o.isExit > 1) { o.isExit = 1; }
                    o.isGhost = r.isGhost;
                    if (o.isGhost > 1) { o.isGhost = 1; }
                    o.isMissing = r.isMissing;
                    if (o.isMissing > 1) { o.isMissing = 1; }
                    o.isMove = r.isMove;
                    if (o.isMove > 1) { o.isMove = 1; }
                    o.isReacquired = r.isReacquired;
                    if (o.isReacquired > 1) { o.isReacquired = 1; }
                    o.isRegion = r.isRegion;
                    if (o.isRegion > 1) { o.isRegion = 1; }
                    o.isSold = r.isSold;
                    o.isValid = r.isValid;
                    if (o.isValid > 1) { o.isValid = 1; }
                    obj.paths[r.id].push(o);
                    obj.list.push(o);
                    callback();
                }, function (err) {
                    if (err) {
                        console.log(err.message);
                        return next(err);
                    }
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
            if (isExit !== undefined && isExit !== '') {
                sql += "AND isExit=? ";
                parmList.push(isExit);
            }
            if (isGhost !== undefined && isGhost !== '') {
                sql += "AND isGhost=? ";
                parmList.push(isGhost);
            }
            if (isMissing !== undefined && isMissing !== '') {
                sql += "AND isMissing=? ";
                parmList.push(isMissing);
            }
            if (isMove !== undefined && isMove !== '') {
                sql += "AND isMove=? ";
                parmList.push(isMove);
            }
            if (isRegion !== undefined && isRegion !== '') {
                sql += "AND isRegion=? ";
                parmList.push(isRegion);
            }
            if (isValid !== undefined && isValid !== '') {
                sql += "AND isValid=? ";
                parmList.push(isValid);
            }
            if (id !== undefined && id !== '') {
                sql += "AND id=? ";
                parmList.push(id);
            }
            sql += "ORDER BY styleName, ts ";
            console.log(sql);
            console.log(parmList);
            console.log("STARTING POINTS QUERY");
            con.query(sql, parmList, function (err, results) {
                console.log("GOT THEM");
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
                    o.isExit = r.isExit;
                    if (o.isExit > 1) { o.isExit = 1; }
                    o.isGhost = r.isGhost;
                    if (o.isGhost > 1) { o.isGhost = 1; }
                    o.isMissing = r.isMissing;
                    if (o.isMissing > 1) { o.isMissing = 1; }
                    o.isMove = r.isMove;
                    if (o.isMove > 1) { o.isMove = 1; }
                    o.isReacquired = r.isReacquired;
                    if (o.isReacquired > 1) { o.isReacquired = 1; }
                    o.isRegion = r.isRegion;
                    if (o.isRegion > 1) { o.isRegion = 1; }
                    o.isSold = r.isSold;
                    o.isValid = r.isValid;
                    if (o.isValid > 1) { o.isValid = 1; }
                    obj.paths[r.id].push(o);
                    obj.list.push(o);
                    callback();
                }, function (err) {
                    if (err) {
                        console.log(err.message);
                        return next(err);
                    }
                    return next(null, obj);
                });
            });
        }
    }

}