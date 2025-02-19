const sendMail = require('./sendMail');

async function reportErrorToAdmins(userId, errorMessage, stackTrace, errorOrigin, inputData) {
    try {
        const errorData = {
            userId,
            errorMessage,
            stackTrace,
            errorOrigin,
            inputData,
        };

        const mailOptions = {
            emails: ['celikrecep289@gmail.com'],
            subject: "Critical Error Report",
            message: generateErrorHtml(errorData)
        };
        await sendMail(mailOptions);
    } catch (err) {
        console.log("error reporting failed : ", err);
    }
}

const generateErrorHtml = (errorData) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #fff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background-color: #ff4c4c;
            color: white;
            text-align: center;
            padding: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
        }
        .content h2 {
            margin-top: 0;
            color: #ff4c4c;
        }
        .content p {
            margin: 10px 0;
            line-height: 1.6;
        }
        .highlight {
            background-color: #f9f2f4;
            border-left: 4px solid #ff4c4c;
            padding: 10px;
            font-family: monospace;
            color: #c7254e;
            overflow-x: auto;
        }
        .footer {
            text-align: center;
            background-color: #f4f4f9;
            padding: 15px;
            font-size: 14px;
            color: #666;
            border-top: 1px solid #ddd;
        }
        .footer a {
            color: #ff4c4c;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Error Report</h1>
        </div>
        <div class="content">
            <h2>An error has been detected!</h2>
            <p><strong>User ID:</strong> ${errorData.userId}</p>
            <p><strong>Error Message:</strong></p>
            <div class="highlight">
                ${errorData.errorMessage}
            </div>
            <p><strong>Origin:</strong> ${errorData.errorOrigin}</p>
            <p><strong>Stack Trace:</strong></p>
            <div class="highlight">
                ${errorData.stackTrace.replace(/\n/g, '<br>')}
            </div>
            <p><strong>Input Data:</strong></p>
            <div class="highlight">
                ${JSON.stringify(errorData.inputData, null, 2).replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;')}
            </div>
        </div>
        <div class="footer">
            <p>For more details, visit the <a href="#">admin panel</a>.</p>
        </div>
    </div>
</body>
</html>
`;
};

module.exports = reportErrorToAdmins;