const sendPasswordResetEmail = (email, name, resetUrl) => {

    const mailDetails = {
        emails: email,
        subject: 'Reset Your Password',
        message: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Your Password</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 50px auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                        font-size: 16px;
                        line-height: 1.6;
                    }
                    .header {
                        background-color: #0056b3;
                        color: #ffffff;
                        padding: 20px;
                        text-align: center;
                        font-size: 24px;
                        font-weight: bold;
                    }
                    .content {
                        padding: 30px;
                        text-align: center;
                    }
                    .content h1 {
                        font-size: 28px;
                        color: #0056b3;
                        margin-bottom: 20px;
                    }
                    .content p {
                        color: #555555;
                        margin: 10px 0;
                    }
                    .button-wrapper {
                        margin: 30px 0;
                        text-align: center;
                    }
                    .button {
                        padding: 15px 40px;
                        font-size: 18px;
                        color: #ffffff;
                        background-color: #0056b3;
                        border-radius: 8px;
                        text-decoration: none;
                        display: inline-block;
                        transition: background-color 0.3s ease, transform 0.2s ease;
                    }
                    .button:hover {
                        background-color: #003d80;
                        transform: translateY(-3px);
                    }
                    .footer {
                        background-color: #f1f1f1;
                        color: #888888;
                        padding: 20px;
                        text-align: center;
                        font-size: 14px;
                    }
                    .footer a {
                        color: #0056b3;
                        text-decoration: none;
                    }
                    .footer a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">Password Reset</div>
                    <div class="content">
                        <h1>Reset Your Password</h1>
                        <p>Hello ${name},</p>
                        <p>We received a request to reset your password. Please click the button below to set a new password:</p>
                        <div class="button-wrapper">
                            <a href="${resetUrl}" class="button">Reset Password</a>
                        </div>
                        <p>If you did not request this, you can safely ignore this email. If you have any concerns, please contact our support team.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} Startxpress. All Rights Reserved.</p>
                        <p><a href="https://www.startxpress.com/privacy">Privacy Policy</a> | <a href="https://www.startxpress.com/support">Support</a></p>
                    </div>
                </div>
            </body>
            </html>
        `
    }

    return mailDetails;
}

module.exports = sendPasswordResetEmail;