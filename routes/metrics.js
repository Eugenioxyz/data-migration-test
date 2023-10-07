const express = require('express');
const router = express.Router();
const db = require('../dbInit'); 

/* 
    Number of employees hired for each job and department in 2021 divided by quarter. 
    Ordered alphabetically by department and job
*/
router.get('/hired-by-quarter', (req, res) => {
  const sql = `
    SELECT
        d.department,
        j.job,
        SUM(CASE WHEN strftime('%m', he.datetime) BETWEEN '01' AND '03' THEN 1 ELSE 0 END) AS Q1,
        SUM(CASE WHEN strftime('%m', he.datetime) BETWEEN '04' AND '06' THEN 1 ELSE 0 END) AS Q2,
        SUM(CASE WHEN strftime('%m', he.datetime) BETWEEN '07' AND '09' THEN 1 ELSE 0 END) AS Q3,
        SUM(CASE WHEN strftime('%m', he.datetime) BETWEEN '10' AND '12' THEN 1 ELSE 0 END) AS Q4
    FROM hired_employees he
    JOIN departments d ON he.department_id = d.id
    JOIN jobs j ON he.job_id = j.id
    WHERE strftime('%Y', he.datetime) = '2021'
    GROUP BY d.department, j.job
    ORDER BY d.department, j.job;
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to fetch metrics' });
    } else {
      res.json(rows);
    }
  });
});


/*
    List of ids, name and number of employees hired of each department that hired more employees than the mean of employees hired in 2021 for all the departments, 
    Ordered by the number of employees hired (desc). 
*/
router.get('/above-average-hires', (req, res) => {
  const sql = `
    SELECT
        d.id,
        d.department,
        COUNT(*) AS hired
    FROM hired_employees he
    JOIN departments d ON he.department_id = d.id
    WHERE strftime('%Y', he.datetime) = '2021'
    GROUP BY d.id, d.department
    HAVING hired > (
        SELECT AVG(hired)
        FROM (
            SELECT department_id, COUNT(*) AS hired
            FROM hired_employees
            WHERE strftime('%Y', datetime) = '2021'
            GROUP BY department_id
        )
    )
    ORDER BY hired DESC;
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to fetch metrics' });
    } else {
      res.json(rows);
    }
  });
});

module.exports = router;
