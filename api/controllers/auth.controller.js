import User from "../models/user.models.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password, userType, fullname, address, dateofbirth, gender } = req.body;

  if (!username || !email || !password || !userType || !fullname || !address || !dateofbirth || !gender ||
    username === '' || email === '' || password === '' || userType === '' || fullname === '' || address === '' ) {
    return next(errorHandler(400, 'All fields are required'));
}

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    fullname,
    address,
    dateofbirth: new Date(dateofbirth), // Convert dateofbirth string to Date object
    gender,
    userType,
    isAdmin: userType === 'admin',
    isEmp: userType === 'employer',
    isInst: userType === 'institute',
    isUser: userType === 'general'
});

  try {
      await newUser.save();
      res.json('Signup Successful');
  } catch (error) {
      next(error);
  }

      const tokenPayload = {
        id: newUser._id,
        userType: newUser.userType, // Include userType in token payload
        // Other fields as needed
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
    
};


export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email }); // Fetch user from the database
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }
    
    
    const token = jwt.sign({ 
      id: validUser._id, 
      isAdmin: validUser.isAdmin, 
      isUser: validUser.isUser, 
      isEmp: validUser.isEmp, 
      isInst: validUser.isInst 
    }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};


export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl, userType } = req.body; // Receive userType from the request body
  try {
    const user = await User.findOne({ email });
    if (user) {
      // If user already exists, generate token and send user data along with token
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin, isUser: user.isUser, isEmp: user.isEmp, isInst: user.isInst },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      return res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest);
    } else {
      // If user doesn't exist, create new user with selected userType
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: name.toLowerCase().split(' ').join(' ') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        userType: userType // Save selected userType
      });
      switch (userType) {
        case 'admin':
          newUser.isAdmin = true;
          break;
        case 'employer':
          newUser.isEmp = true;
          break;
        case 'institute':
          newUser.isInst = true;
          break;
        case 'general':
        default:
          newUser.isUser = true;
          break;
      }
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin, isUser: newUser.isUser, isEmp: newUser.isEmp, isInst: newUser.isInst },
        process.env.JWT_SECRET
      );
      const { pass, ...rest } = newUser._doc;
      return res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest);
    }
  } catch (error) {
    next(error);
  }
};
