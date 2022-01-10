var express = require('express');
router = express.Router();
var async = require('async');
var TestDAO = require(__base + "dao/testdao");
var testDao = new TestDAO();

router.get('/map', function (req, res) {
    const cert = req.connection.getPeerCertificate()
    if (req.client.authorized) {
        res.render('map');
    } else {
        res.status(401).send(`Sorry, but you need to provide a client certificate to continue.`);
    }
});

router.get('/map2', function (req, res) {
    const cert = req.connection.getPeerCertificate()
    if (req.client.authorized) {
        res.render('map2');

    } else {
        res.status(401).send(`Sorry, but you need to provide a client certificate to continue.`);
    }
});

router.get('/neomap', function (req, res) {
    const cert = req.connection.getPeerCertificate()
    if (req.client.authorized) {
        res.render('neomap');
    } else {
        res.status(401).send(`Sorry, but you need to provide a client certificate to continue.`);
    }
});

router.put('/api/region/list', function (req, res) {
    const cert = req.connection.getPeerCertificate()
    if (req.client.authorized) {
        var obj = req.body;
        testDao.regions(obj.storeId, function (err, list) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            return res.send(list);
        });
    } else {
        var o = new Object();
        o.message = "FAIL";
        return res.send(o);
    }
});

router.put('/api/sku/home', function (req, res) {
    const cert = req.connection.getPeerCertificate()
    if (req.client.authorized) {
        var obj = req.body;
        testDao.homeZone(obj.productId, obj.style, obj.storeId, obj.k, function (err, result) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            return res.send(result);
        });
    } else {
        var o = new Object();
        o.message = "FAIL";
        return res.send(o);
    }
});

router.put('/api/dept/list', function (req, res) {
    const cert = req.connection.getPeerCertificate()
    if (req.client.authorized) {
        var obj = req.body;
        testDao.allDept(obj.storeId, function (err, list) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            return res.send(list);
        });
    } else {
        var o = new Object();
        o.message = "FAIL";
        return res.send(o);
    }
});

router.put('/api/subdept/list', function (req, res) {
    const cert = req.connection.getPeerCertificate()
    if (req.client.authorized) {
        var obj = req.body;
        testDao.subDept(obj.storeId, obj.dept, function (err, list) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            return res.send(list);
        });
    } else {
        var o = new Object();
        o.message = "FAIL";
        return res.send(o);
    }
});

router.put('/api/class/list', function (req, res) {
    const cert = req.connection.getPeerCertificate()
    if (req.client.authorized) {
        var obj = req.body;
        testDao.classes(obj.storeId, obj.dept, obj.subDept, function (err, list) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            return res.send(list);
        });
    } else {
        var o = new Object();
        o.message = "FAIL";
        return res.send(o);
    }
});

router.put('/api/subclass/list', function (req, res) {
    const cert = req.connection.getPeerCertificate()
    if (req.client.authorized) {
        var obj = req.body;
        testDao.subClasses(obj.storeId, obj.dept, obj.subDept, obj.class, function (err, list) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            return res.send(list);
        });
    } else {
        var o = new Object();
        o.message = "FAIL";
        return res.send(o);
    }
});

router.put('/api/style/list', function (req, res) {
    const cert = req.connection.getPeerCertificate()
    if (req.client.authorized) {
        var obj = req.body;
        testDao.style(obj.storeId, obj.dept, obj.subDept, obj.class, obj.subClass, function (err, list) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            return res.send(list);
        });
    } else {
        var o = new Object();
        o.message = "FAIL";
        return res.send(o);
    }
});

// router.get('/api/sync/metro', function (req, res) {
//     var cmd = require('node-cmd');
//     cmd.run('python3 /home/ubuntu/lulu_test/update.py');
//     return res.send("OK");
// });

// router.get('/api/sync/wested', function (req, res) {
//     var cmd = require('node-cmd');
//     cmd.run('python3 /home/ubuntu/lulu_test/update2.py');
//     return res.send("OK");
// });

router.put('/api/sku/list', function (req, res) {
    const cert = req.connection.getPeerCertificate()
    if (req.client.authorized) {
        var obj = req.body;
        testDao.sku(obj.storeId, obj.dept, obj.subDept, obj.class, obj.subClass, obj.style, function (err, list) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            return res.send(list);
        });
    } else {
        var o = new Object();
        o.message = "FAIL";
        return res.send(o);
    }


});

router.put('/api/points/list', function (req, res) {
    const cert = req.connection.getPeerCertificate()
    if (req.client.authorized) {
        var obj = req.body;
        testDao.points(obj.storeId, obj.dept, obj.subDept, obj.class, obj.subClass, obj.style, obj.year, obj.month, obj.day, obj.hour, obj.productId, obj.regions, obj.id, obj.isDeparture, obj.isExit, obj.isGhost, obj.isMissing, obj.isMove, obj.isRegion, obj.isValid, obj.table, obj.limit, function (err, list) {
            if (err) {
                console.log(err);
                return res.send(err);
            }
            return res.send(list);
        });
    } else {
        var o = new Object();
        o.message = "FAIL";
        return res.send(o);
    }
});

module.exports = router;