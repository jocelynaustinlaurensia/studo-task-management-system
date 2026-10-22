const fs = require('fs');
const path = require('path');

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(
  __dirname,
  'assignments.json'
);

function readAssignments() {

  const data =
    fs.readFileSync(DATA_FILE, 'utf8');

  return JSON.parse(data);
}

function saveAssignments(data) {

  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(data, null, 2)
  );

}

app.get('/api/assignments', (req, res) => {

  const assignments =
    readAssignments();

  res.json(assignments);

});

app.post('/api/assignments', (req, res) => {

  const assignments =
    readAssignments();

  const newAssignment = {

    id: Date.now(),

    title: req.body.title,

    lecturer: req.body.lecturer,

    deadline: req.body.deadline,

    status: req.body.status

  };

  assignments.push(newAssignment);

  saveAssignments(assignments);

  res.json({
    success: true
  });

});

app.delete('/api/assignments/:id', (req, res) => {

  let assignments =
    readAssignments();

  assignments =
    assignments.filter(
      a => a.id != req.params.id
    );

  saveAssignments(assignments);

  res.json({
    success: true
  });

});

app.put('/api/assignments/:id', (req, res) => {

  let assignments =
    readAssignments();

  assignments =
    assignments.map(a => {

      if (a.id == req.params.id) {

        return {
          ...a,

          title: req.body.title,

          lecturer: req.body.lecturer,

          deadline: req.body.deadline,

          status: req.body.status
        };
      }

      return a;

    });

  saveAssignments(assignments);

  res.json({
    success: true
  });

});

const users = [
  { username: 'mahasiswa', password: '1234', name: 'Mahasiswa' }
];

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password harus diisi.' });
  }
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return res.status(200).json({ success: true, message: 'Login berhasil.', name: user.name });
  } else {
    return res.status(401).json({ success: false, message: 'Username atau password salah.' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'STUDO Backend berjalan.' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
