SELECT id, yyyy, mm, dd FROM WackedData WHERE total>500



DROP TABLE IF EXISTS WackedData;

CREATE TABLE WackedData (id VARCHAR(40), yyyy INTEGER DEFAULT 0, mm INTEGER DEFAULT 0, dd INTEGER DEFAULT 0, h INTEGER DEFAULT 0, m INTEGER DEFAULT 0, total INTEGER DEFAULT 0, PRIMARY KEY (id, yyyy, mm, dd, h, m));

INSERT INTO WackedData (id, yyyy, mm, dd, h, m, total) SELECT id, yyyy, mm, dd, HOUR(ts), FLOOR(MINUTE(ts)), COUNT(*) FROM EpcMovement GROUP BY id, yyyy, mm, dd, HOUR(ts), FLOOR(MINUTE(ts));

SELECT x.yyyy, x.mm, x.dd, SUM(x.total) AS total, SUM(x.good) AS good, SUM(x.wacked) AS wacked FROM (SELECT yyyy, mm, dd, COUNT(*) AS total, 0 AS good, 0 AS wacked FROM WackedData GROUP BY yyyy, mm, dd UNION SELECT yyyy, mm, dd, 0, COUNT(*), 0 FROM WackedData WHERE total<=100 GROUP BY yyyy, mm, dd UNION SELECT yyyy, mm, dd, 0, 0, COUNT(*) FROM WackedData WHERE total>100 GROUP BY yyyy, mm, dd ) AS x GROUP BY x.yyyy, x.mm, x.dd ORDER BY x.yyyy, x.mm, x.dd;
