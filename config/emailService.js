import http from 'http';
import nodemailer  from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config();


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASS,
    }
})

async function  sendEmail(to,subject, text, html) { 
    try{
        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            text,
            html,
        })
        console.log(true)

        return {success: true,messageId: info.messageId}
    }catch(error){
        return {success: false, error: error.message}
    }
    
}

export default sendEmail;