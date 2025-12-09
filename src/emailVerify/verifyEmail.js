import nodemailer from "nodemailer";
import dotenv from "dotenv/config"

export const verifyEmail = async (token, email) => {
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.mailUser,
            pass: process.env.mailPass
        }
    });

    const mailConfiguration = {
        from: process.env.mailUser,
        to: email,
        subject: "For user verification purpose",
        text: `for verify yourself just click on this link http://localhost:5173/user/verify/${token}`
    };

    transport.sendMail(mailConfiguration, function (error, info) {
        if (error) {
            console.error(error);
            console.log("Email cannot sent!");
        }
        console.log("Email send successfully!");
        console.log(info);
    })
}