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
              <p>Thank you for choosing  DoctorSaathi!</p>
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

export const Enquiry_Email_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Enquiry is Received - DoctorSaathi</title>
  <style>
      body {
          font-family: 'Segoe UI', Arial, sans-serif;
          background-color: #f0f8ff;
          margin: 0;
          padding: 0;
          color: #333;
      }
      .email-container {
          max-width: 600px;
          background: #ffffff;
          margin: 40px auto;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #e0e0e0;
      }
      .header {
          background: linear-gradient(135deg, #00b4d8, #0077b6);
          color: white;
          text-align: center;
          padding: 25px 20px;
          font-size: 26px;
          font-weight: bold;
          letter-spacing: 0.5px;
      }
      .header img {
          width: 60px;
          margin-bottom: 10px;
      }
      .content {
          padding: 30px 25px;
          line-height: 1.7;
      }
      .content h2 {
          color: #0077b6;
          font-size: 22px;
          margin-bottom: 15px;
      }
      .content p {
          font-size: 16px;
          margin-bottom: 15px;
      }
      .highlight {
          background-color: #e6f7ff;
          padding: 10px 15px;
          border-left: 4px solid #00b4d8;
          border-radius: 5px;
          margin: 20px 0;
      }
      .footer {
          background-color: #f9f9f9;
          text-align: center;
          padding: 15px;
          font-size: 13px;
          color: #666;
          border-top: 1px solid #e0e0e0;
      }
      .footer a {
          color: #0077b6;
          text-decoration: none;
      }
  </style>
</head>
<body>
  <div class="email-container">
      <div class="header">
          <img src="https://cdn-icons-png.flaticon.com/512/2966/2966488.png" alt="DoctorSaathi Logo" />
          DoctorSaathi
      </div>

      <div class="content">
          <h2>Hi {name},</h2>
          <p>Thank you for getting in touch with <strong>DoctorSaathi</strong>. We've successfully received your enquiry.</p>

          <div class="highlight">
              Our healthcare team will review your message and get back to you shortly with the best possible assistance.
          </div>

          <p>If you need urgent help, feel free to contact us at:</p>
          <p><strong>Email:</strong> support@doctorsaathi.com</p>
          <p><strong>Website:</strong> <a href="https://www.doctorsaathi.com">www.doctorsaathi.com</a></p>

          <p>Stay healthy and take care,<br>
          <strong>Team DoctorSaathi</strong></p>
      </div>

      <div class="footer">
          &copy; ${new Date().getFullYear()} DoctorSaathi. All rights reserved. |
          <a href="https://www.doctorsaathi.com/privacy">Privacy Policy</a>
      </div>
  </div>
</body>
</html>
`;
