

function verificationEmail(username, otp) {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container{
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            padding: 20px;
            margin: 20px 0;
        }

        .footer{
            text-align: center;
            font-size: 14px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verify Your Email Address</h1>
        </div>
        <div class="content">
            <p>Thank you for registering with Spicez Gold. Please use th e OTP below to verify your email address:</p>
            <div class="otp">${otp}</div>
            <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Spicez Gold. All rights reserved.</p>

        </div>
    </div>
</body>
</html>
    
    `
    
}

export default verificationEmail;
