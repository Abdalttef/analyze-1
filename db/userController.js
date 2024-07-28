const db = require('./index');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const User =db.User;

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

    await validateEmailDomain(email); 
    
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

    console.log('Login successful for user:', user.username);
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





