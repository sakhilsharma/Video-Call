import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt, { hash } from 'bcrypt';
import { Meeting } from "../models/meeting.model.js"
import crypto from "crypto"
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please Provide" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" })
    }
    let isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      //cryto 
      let token = crypto.randomBytes(20).toString("hex");
      //this token was defind in the scehma that takes value as user is loged in
      user.token = token;
      await user.save();

 ///with tokne also return name and username
      return res.status(httpStatus.OK).json({
        token: token,
        user: {
          name: user.name,
          username: user.username
        }
      });
    }
  }
  catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid User Credentials" });
  }
}

const register = async (req, res) => {
  const { name, username, password } = req.body;
  console.log(req.body);

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(httpStatus.FOUND).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword
    });

    await newUser.save();

    res.status(httpStatus.CREATED).json({ message: "User Registered" })

  } catch (e) {
    res.json({ message: `Something went wrong ${e}` })
  }
}


//extra functions of user History
const getUserHistory = async (req, res) => {
  const { token } = req.query;


  try {
    const user = await User.findOne({ token: token });
    const meetings = await Meeting.find({ user_id: user.username })

    res.json(meetings)
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` })
  }
}

const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body;
  console.log(req.body.token);
  try {
    const user = await User.findOne({ token: token });

    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meeting_code
    })

    await newMeeting.save();

    res.status(httpStatus.CREATED).json({ message: "Added code to history" })
  } catch (e) {
    res.json({ message: `Something went wrong ${e}` })
  }
}
const getUser = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                message: "Token is required"
            });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        return res.status(200).json({
            user: {
                name: user.name,
                username: user.username
            }
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

export { register, login, getUserHistory, addToHistory ,getUser}