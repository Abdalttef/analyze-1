const db = require('./index');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
require('dotenv').config();
const jwt = require('jsonwebtoken');


const User =db.User;

const jwtSecret = process.env.JWT_SECRET
// const User = require('./user')


//handle the sign up requests
exports.register = async (req, res) => {
  const { email, username, password,confirmPassword } = req.body;
  console.log('Request received:', req.body); 


  if (!email || !username || !password) {
    return res.status(400).json({ error: 'يرجى إدخال جميع الحقول' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'كلمة المرور غير متطابقة، يرجى التأكد من إدخال نفس كلمة المرور في كلا الحقلين'});
  }
  
  try {
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'البريد الإلكتروني الذي أدخلته قيد الاستخدام بالفعل، يرجى استخدام بريد إلكتروني آخر' });
    }


    const existingUsername = await db.User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ error: 'اسم المستخدم الذي أدخلته قيد الاستخدام بالفعل، يرجى استخدام اسم مستخدم آخر' });
    }

  
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.User.create({ email, username, password: hashedPassword });
    console.log('User created:', user); 


    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//handle the login requests
exports.login = async (req, res) => {
  try {
    const { usernameEmail, password } = req.body;
    
    console.log('Received login data:', { usernameEmail, password });

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: usernameEmail }, { username: usernameEmail }]
      }
    });

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'لم يتم العثور على المستخدم، يرجى التحقق من البريد الإلكتروني أو اسم المستخدم' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Invalid credentials');
      return res.status(400).json({ error: 'بيانات الدخول غير صحيحة، تأكد من إدخال البريد الإلكتروني وكلمة المرور بشكل صحيح' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      jwtSecret,
      { expiresIn: '1h' } 
    );

    console.log('Login successful for user:', user.username);
    res.status(200).json({ token }); 
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// handle pass change
exports.changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedNewPassword });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// //handle logout 
// const blacklistedTokens = new Set(); 

// exports.logout = (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1]; 

//   if (token) {
//     blacklistedTokens.add(token);

//     res.status(200).json({ message: 'Logged out successfully' });
//   } else {
//     res.status(400).json({ message: 'No token provided' });
//   }
// };
const blacklistedTokens = new Set(); 
exports.logout = (req, res) => {
  
  res.clearCookie('token'); 

  // if (token) {
  //       blacklistedTokens.add(token);
    
  //       res.status(200).json({ message: 'Logged out successfully' });
  //     } else {
  //       res.status(400).json({ message: 'No token provided' });
  //     }
  res.status(200).json({ message: 'Logged out successfully' });
};





exports.test= (req, res) => {
    console.log("test")
  const filePath = path.join(__dirname, "Book1.xlsx");

  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;

  const sheet = workbook.Sheets[sheetNames[0]];

  const data = XLSX.utils.sheet_to_json(sheet);

  res.json(data);
};
