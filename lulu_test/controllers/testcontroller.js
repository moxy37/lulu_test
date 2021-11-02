var express = require('express');
router = express.Router();
var async = require('async');
var con = require(__base + 'dbConnection');
var TestDAO = require(__base + "dao/testdao");
var testDao = new TestDAO();

router.put('/api/dept/list', function (req, res) {
    var obj = req.body;
    testDao.allDept(obj.storeId, function (err, list) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.send(list);
    });
});

router.put('/api/subdept/list', function (req, res) {
    var obj = req.body;
    testDao.subDept(obj.storeId, obj.dept, function (err, list) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.send(list);
    });
});

router.put('/api/class/list', function (req, res) {
    var obj = req.body;
    testDao.classes(obj.storeId, obj.dept, obj.subDept, function (err, list) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.send(list);
    });
});

router.put('/api/subclass/list', function (req, res) {
    var obj = req.body;
    testDao.subClasses(obj.storeId, obj.dept, obj.subDept, obj.class, function (err, list) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.send(list);
    });
});

router.put('/api/style/list', function (req, res) {
    var obj = req.body;
    testDao.style(obj.storeId, obj.dept, obj.subDept, obj.class, obj.subClass, function (err, list) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.send(list);
    });
});

router.get('/api/sync/metro', function (req, res) {
    var cmd = require('node-cmd');
    cmd.run('python3 /home/ubuntu/lulu_test/update.py');
    return res.send("OK");
});

router.get('/api/sync/wested', function (req, res) {
    var cmd = require('node-cmd');
    cmd.run('python3 /home/ubuntu/lulu_test/update2.py');
    return res.send("OK");
});

router.put('/api/upc/list', function (req, res) {
    var obj = req.body;
    testDao.upc(obj.storeId, obj.dept, obj.subDept, obj.class, obj.subClass, obj.style, obj.year, obj.month, obj.day, obj.table, obj.limit, function (err, list) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.send(list);
    });
});

router.put('/api/points/list', function (req, res) {
    var obj = req.body;
    testDao.points(obj.storeId, obj.dept, obj.subDept, obj.class, obj.subClass, obj.style, obj.year, obj.month, obj.day, obj.productId, obj.table, obj.limit, function (err, list) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.send(list);
    });
});

module.exports = router;