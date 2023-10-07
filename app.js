const express = require('express');
const app = express();
const path = require('path');
const migrationRouter = require('./routes/migration');
const metricsRouter = require('./routes/metrics');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/migration', migrationRouter);
app.use('/metrics', metricsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
