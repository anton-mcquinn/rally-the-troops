// src/controllers/authController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create a new user instance
        user = new User({
            username,
            email,
            password
        });

        // Hash the password before saving the user
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save the user to the database
        await user.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
    if (err instanceof Error) {
            console.error(err.message);
            res.status(500).send('Server error');
        } else {
            console.error('An unexpected error occurred');
            res.status(500).send('Server error');
        }
    }
};

