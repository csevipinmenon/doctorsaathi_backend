export const Verification_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .verification-code {
              display: block;
              margin: 20px 0;
              font-size: 22px;
              color: #4CAF50;
              background: #e8f5e9;
              border: 1px dashed #4CAF50;
              padding: 10px;
              text-align: center;
              border-radius: 5px;
              font-weight: bold;
              letter-spacing: 2px;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Verify Your Email</div>
          <div class="content">
              <p>Hello <span> {name} </span>,</p>
              <p>Thank you for DoctorSaathi!</p>
              <p>To verify your email address, please use the following verification code:</p>
              <span class="verification-code">{verificationCode}</span>
              <p>Enter this code in the app or website to complete your Forget Your password.</p>
              <p>If you didn’t request this, please ignore this message.</p>
              <p>Thanks,</p>
              <p><strong>Team DoctorSaathi</strong></p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} DoctorSaathi. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;
export const Password_Change_Success_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Changed Successfully</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #28a745;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.8;
          }
          .message {
              font-size: 18px;
              margin: 20px 0;
              color: #333;
          }
          .button {
              display: inline-block;
              padding: 12px 25px;
              margin: 20px 0;
              background-color: #28a745;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              transition: background-color 0.3s;
          }
          .button:hover {
              background-color: #218838;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Password Changed Successfully</div>
          <div class="content">
              <p class="message">Hello {name},</p>
              <p>Your password has been updated successfully for your <strong>DoctorSaathi</strong> account.</p>
              <p>If you did not perform this action, please reset your password immediately or contact our support team.</p>
              <a href="#" class="button">Login Now</a>
              <p>Stay safe, and thank you for trusting us.</p>
              <p><strong>Team DoctorSaathi</strong></p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} DoctorSaathi. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;
