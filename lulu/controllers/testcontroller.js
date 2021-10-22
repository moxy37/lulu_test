var express = require('express');
router = express.Router();
var async = require('async');
var con = require(__base + 'dbConnection');
var uuid = require("node-uuid");
var TestDAO = require(__base + "dao/testdao");
var testDao = new TestDAO();

router.get('/api/dept/list', function (req, res) {

    testDao.allDept(function (err, list) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.send(list);
    });
});

router.put('/api/subdept/list', function (req, res) {
    var obj = req.body;
    testDao.subDept(obj.dept, function (err, list) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.send(list);
    });
});

router.put('/api/class/list', function (req, res) {
    var obj = req.body;
    testDao.classes(obj.dept, obj.subDept, function (err, list) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.send(list);
    });
});

router.put('/api/subclass/list', function (req, res) {
    var obj = req.body;
    testDao.subClasses(obj.dept, obj.subDept, obj.class, function (err, list) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.send(list);
    });
});

router.put('/api/style/list', function (req, res) {
    var obj = req.body;
    testDao.style(obj.dept, obj.subDept, obj.class, obj.subClass, function (err, list) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.send(list);
    });
});

router.get('/api/sync/metro', function (req, res) {
    var cmd=require('node-cmd');
    cmd.run('python3 /home/ubuntu/lulu_test/update.py');
});

router.put('/api/upc/list', function (req, res) {
    var obj = req.body;
    testDao.upc(obj.dept, obj.subDept, obj.class, obj.subClass, obj.style, obj.year, obj.month, obj.day, obj.table, obj.limit, function (err, list) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.send(list);
    });
});

router.put('/api/points/list', function (req, res) {
    var obj = req.body;
    testDao.points(obj.dept, obj.subDept, obj.class, obj.subClass, obj.style, obj.year, obj.month, obj.day, obj.productId, obj.table, obj.limit, function (err, list) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        return res.send(list);
    });
});

// router.get('/tetris', function (req, res) {
//     res.render('wemos/tetris');
// });

module.exports = router;