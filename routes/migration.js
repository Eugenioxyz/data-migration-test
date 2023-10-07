const express = require('express');
const db = require('../dbInit');
const router = express.Router();
const multer = require('multer');
const csv = require('fast-csv');

// Configure multer to handle file uploads and store in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to parse CSV data
const parseCSV = async (csvData) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const parser = csv.parseString(csvData);

    parser.on('error', (error) => {
      console.error('Error parsing CSV:', error.message);
      reject(error);
    });

    parser.on('data', (row) => {
      results.push(row);
    });

    parser.on('end', () => {
      resolve(results);
    });
  });
};

// Function to insert data into the database in batches
const insertBatchData = async (tableName, data, columnNames = []) => {
  const batchSize = 1000; 
    if (data.length === 0) {
      return;
    }

    const placeholders = columnNames.map(() => '?').join(',');
    const insertQuery = `INSERT INTO ${tableName} (${columnNames.join(',')}) VALUES`;

    for (let i = 0; i < data.length; i += batchSize) {
      const batchData = data.slice(i, i + batchSize);
      const values = batchData.map(() => `(${placeholders})`).join(', ');

      const query = `${insertQuery} ${values}`;
      await db.run(query, batchData.flat());
    }
};


// POST endpoint for uploading CSV files and insert in the db
router.post('/upload', upload.fields([
    { name: 'hired_employees', maxFileSize: 1024 * 1024 },
    { name: 'departments', maxFileSize: 1024 * 1024 },
    { name: 'jobs', maxFileSize: 1024 * 1024 },
]), async (req, res) => {
  const departmentsFile = req.files['departments'][0];
  const hiredEmployeesFile = req.files['hired_employees'][0];
  const jobsFile = req.files['jobs'][0];

  try {
    await db.run('BEGIN TRANSACTION');

    // Check if all required files are provided
    if (!departmentsFile || !hiredEmployeesFile || !jobsFile) {
      return res.status(400).json({ error: 'Missing file fields' });
    }

    // Parse CSV files
    const departmentsText = departmentsFile.buffer.toString();
    const hiredEmployeesText = hiredEmployeesFile.buffer.toString();
    const jobsText = jobsFile.buffer.toString();

    const departmentsData = await parseCSV(departmentsText);
    const hiredEmployeesData = await parseCSV(hiredEmployeesText);
    const jobsData = await parseCSV(jobsText);

    // Insert parsed data into respective database tables
    await insertBatchData('departments', departmentsData, ['id', 'department']);
    await insertBatchData('hired_employees', hiredEmployeesData, ['id', 'name', 'datetime', 'department_id', 'job_id']);
    await insertBatchData('jobs', jobsData, ['id', 'job']);
    
    // Commit the transaction if everything is successful
    await db.run('COMMIT');
    res.status(200).send({ message: 'Data uploaded successfully!' });
  } catch (error) {
    // Rollback the transaction in case of an error
    await db.run('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Data migration failed' });
  }
});

module.exports = router;
