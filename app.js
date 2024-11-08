
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db');
const userRoutes = require('./db/userRoutes');
const cors = require('cors'); 
const multer = require('multer');
const cookieParser = require('cookie-parser');
const xlsx = require('xlsx');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('./db/user'); 
const app = express();

app.use(cookieParser());
// app.use(cors({
//   origin: 'http://127.0.0.1:5500', 
//   methods: ['GET', 'POST'],
//   credentials: true
// }));


app.use(cors());

const PORT = process.env.PORT || 3000;
// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/users', userRoutes);
// Upload endpoint
const JWT_SECRET = process.env.JWT_SECRET
//login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Request received:', req.body); 
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find the user by email
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    console.log(token)
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Server-side route for changing password
app.post('/api/users/change-password/:token', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const token = req.params.token;

  if (!token) {
      return res.status(401).json({ message: 'No token provided' });
  }

  try {
      // Verify the JWT token
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;

      // Find the user by ID
      const user = await db.User.findByPk(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check the current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update the password
      user.password = hashedNewPassword;
      await user.save();

      res.json({ message: 'Password changed successfully' });
  } catch (error) {
      console.error('Password change error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});



//uplaod excel sheet (New)
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const className = sheet['D3'] ? sheet['D3'].v : '';
    const month = sheet['C20'] ? sheet['C20'].v : '';
    const cellD17 = sheet['D17'];
    const yearCellValue = cellD17 && cellD17.t === 's' ? cellD17.v : '';
    console.log(yearCellValue)
    const semester = sheet['D10'] ? sheet['D10'].v : '';

    // Extract years from cellD17
    const years = yearCellValue.split('-');
    console.log(years)
    const startYear = years[0] || '';
    const endYear = years[1] || '';

    const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    if (jsonData.length < 28) {
      return res.status(400).json({ error: 'Not enough data in the sheet' });
    }

    const headers = jsonData[26] || []; 
    const students = jsonData.slice(27); 

    for (let i = 0; i < students.length; i++) {
      const row = students[i] || [];
      if (row.every(cell => cell === "")) {
        continue; 
      }

      const studentData = {};
      headers.forEach((header, index) => {
        studentData[header] = row[index] !== undefined ? row[index] : '';
      });

      const dailyAbsences = {};
      for (let day = 1; day <= 30; day++) {
        const key = day.toString();
        dailyAbsences[`day_${day}`] = studentData[key] === 'غ' ? 1 : 
                                       studentData[key] === 'غ.ب' ? 2 : '';
      }

      await db.Student.create({
        student_name: studentData['اسم الطالبة'] || '',
        student_number: studentData['مسلسل'] || null,
        total_absent: studentData['مجموع الغياب بدون عذر'] || null,
        absent: studentData['مجموع الغياب بعذر'] || null,
        ...dailyAbsences,
        class_name: className,
        month: month,
        year:yearCellValue,
        semester
      });
    }

    res.status(200).json({ message: 'Data processed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//get data (New)
app.get('/students', async (req, res) => {
  try {
    const students = await db.Student.findAll();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch student data' });
  }
});





// Sync database and start server
db.sequelize.sync({ alter: true }) // Alter existing tables if needed
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
