const jwt      = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Citizen   = require('../models/Citizen');
const Authority = require('../models/Authority');

const signToken = (id, type) =>
  jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const sendOTP = async (recipient, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: `"CivicSense" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: 'CivicSense — Your OTP',
      html: `<h2>Your OTP: <strong>${otp}</strong></h2><p>Valid for 10 minutes.</p>`
    });
    console.log(otp);
    return true;
  } catch (err) {
    console.log(otp);
    return false; // Indicates mock mode was used
  }
};

// POST /api/auth/citizen/register
exports.citizenRegister = async (req, res) => {
  try {
    const { name, identifier } = req.body; // 'identifier' can be email or phone
    if (!identifier) return res.status(400).json({ error: 'Email or Phone required' });

    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier } : { phone: identifier };

    let citizen = await Citizen.findOne(query);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    if (citizen) {
      citizen.otp = otp;
      citizen.otpExpiry = otpExpiry;
      await citizen.save();
    } else {
      const citizenData = {
        name: name || 'Citizen',
        passwordHash: 'otp_only',
        otp,
        otpExpiry
      };
      if (isEmail) citizenData.email = identifier;
      else citizenData.phone = identifier;

      citizen = new Citizen(citizenData);
      await citizen.save();
    }

    const sent = await sendOTP(identifier, otp);
    res.status(200).json({ 
      message: sent ? 'OTP sent successfully!' : 'OTP generated (Mock Mode - Check Server Console)',
      isMock: !sent 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/citizen/verify-otp
exports.citizenVerifyOTP = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier } : { phone: identifier };

    const citizen = await Citizen.findOne(query);
    if (!citizen) return res.status(404).json({ error: 'Citizen not found' });
    if (citizen.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
    if (citizen.otpExpiry < Date.now()) return res.status(400).json({ error: 'OTP expired' });

    citizen.isVerified = true;
    citizen.otp = undefined;
    citizen.otpExpiry = undefined;
    await citizen.save();

    const token = signToken(citizen._id, 'citizen');
    res.json({ token, citizen: { id: citizen._id, name: citizen.name, email: citizen.email, phone: citizen.phone } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/citizen/login
exports.citizenLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const citizen = await Citizen.findOne({ email });
    if (!citizen) return res.status(401).json({ error: 'Invalid credentials' });
    if (!citizen.isVerified) return res.status(403).json({ error: 'Please verify your email first' });

    const match = await citizen.comparePassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(citizen._id, 'citizen');
    res.json({ token, citizen: { id: citizen._id, name: citizen.name, email: citizen.email, phone: citizen.phone } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/authority/login
exports.authorityLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const authority = await Authority.findOne({ email });
    if (!authority) return res.status(401).json({ error: 'Invalid credentials' });
    if (!authority.isActive) return res.status(403).json({ error: 'Account disabled' });

    const match = await authority.comparePassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(authority._id, 'authority');
    res.json({
      token,
      authority: {
        id: authority._id, name: authority.name,
        email: authority.email, department: authority.department, role: authority.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/authority/register  (admin-only in production, open for hackathon)
exports.authorityRegister = async (req, res) => {
  try {
    const { name, email, department, role, password } = req.body;
    if (!name || !email || !department || !password)
      return res.status(400).json({ error: 'All fields required' });

    const exists = await Authority.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const authority = new Authority({ name, email, department, role: role || 'officer', passwordHash: password });
    await authority.save();
    res.status(201).json({ message: 'Authority account created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
