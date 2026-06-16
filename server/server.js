const express = require('express');
const { db } = require('./db');

const app = express();
const port = 3001;
const host = db.host;

app.use(express.json());

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.get('/api/requests', (req, res) => {
  db.query("SELECT v.*, elig.*, doc.*, CONCAT(v.incomingID, '_', v.examno) AS 'qr' FROM tblverification2 v INNER JOIN tbleligibility elig ON elig.EligibilityID = v.eligtypeid INNER JOIN tbldoctype doc ON doc.doctypeid = v.doctypeid WHERE YEAR(v.daterouted) = YEAR(NOW()) ORDER BY v.priono ASC", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update COE Image path in the database
app.post('/api/update-coe', (req, res) => {
  const { incomingid, authCOEImage } = req.body;
  console.log('Updating COE for incomingid:', incomingid, 'with image path:', authCOEImage);
  db.query("UPDATE tblverification2 SET authCOEImage = ? WHERE incomingid = ?", [authCOEImage, incomingid], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database update failed' });
      return;
    }
    res.json({ success: true });
  });
});

// Update ID Image path in the database
app.post('/api/update-id', (req, res) => {
  const { incomingid, authIDImage } = req.body; 
  console.log('Updating ID for incomingid:', incomingid, 'with image path:', authIDImage);
  db.query("UPDATE tblverification2 SET authIDImage = ? WHERE incomingid = ?", [authIDImage, incomingid], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Database update failed' });
      return;
    }
    res.json({ success: true });
  });
});

// Return signatories from tblactionofficer
app.get('/api/signatories', (req, res) => {
  const sql = "SELECT CONCAT(Lastname, ', ', Firstname, ' ', MI) AS name, Position AS position FROM tblactionofficer";
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Failed to fetch signatories:', err);
      res.status(500).json({ error: 'Failed to fetch signatories' });
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://${host}:${port}`);
});