import connect from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/utilis/mailer';

connect();

export async function POST(req : NextRequest){
    try {
        const reqBody = req.json();
        const { username , email , password}:any = reqBody;

        const user = await User.findOne({email});

        if(user){
            return NextResponse.json({
               error: "user already exists"
            },{status:400})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password ,salt);
        
        const newUser = new User({
            username,
            email,
            password:hashedPassword
        })

        const savedUser = await newUser.save();

        await sendEmail({email,emailType:"VERIFY",userId:savedUser._id})
        return NextResponse.json({
            message:"user registered successfully",
            success:true,
            savedUser
        })

    } catch (error:any) {
        return NextResponse.json({
            error:error.message
        },{status:500})
    }
}