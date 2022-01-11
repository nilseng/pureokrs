import sendgrid from "@sendgrid/mail";

const msg = {
  from: "contact@pureokrs.com",
  text: "Welcome to www.pureokrs.com - the simplest OKR tool on the web. Add your first Objective and Key Results to get started.",
  html: "<strong>Welcome to www.pureokrs.com - the simplest OKR tool on the web. Add your first Objective and Key Results to get started.</strong>",
};

export function sendEmail(email, companyName) {
  msg.subject = companyName + " is registered. Welcome!";
  msg.to = email;
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  sendgrid.send(msg, (err, doc) => {});
  return;
}

export function sendNewUserEmail(email, companyName, token) {
  let msg = {
    from: "contact@pureokrs.com",
    text: `
            Click the following link or paste it in your browser to set a password and activate your user. 
            https://www.pureokrs.com/resetpassword/${email}/${token}
    `,
    html: `
            <body style="min-height: 70vh;">
              <div 
              style="
                background-color:#007bff;
                height:40px;">
              </div>
              <div style="
                background-color:#343a40;
                color:#f8f9fa;
                padding: 10px;">
                <h3 style="color:#f8f9fa">You now have a user at PureOKRs. Welcome!</h3>
                <p
                  style="
                    color:#f8f9fa;
                    "
                >
                  Click the following button to set a password and activate your user.
                </p>
                <a href="https://www.pureokrs.com/resetpassword/${email}/${token}" 
                  style="
                    text-decoration:none;
                    color:#f8f9fa;
                    background-color:#007bff;
                    padding: 2px 6px 2px 6px;
                    border-radius: 2px;"
                >
                  Activate User
                </a>
              </div>
              <div 
                  style="
                    background-color:#007bff;
                    height:20px;">
              </div>
            </body>
    `,
  };
  msg.subject = "You now have a user at PureOKRs. Welcome!";
  msg.to = email;
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  sendgrid.send(msg, (err, doc) => {});
}

export function sendResetEmail(email, token) {
  let msg = {
    from: "contact@pureokrs.com",
    text:
      "Click the following link or paste it in your browser to reset your password. https://www.pureokrs.com/resetpassword/" +
      email +
      "/" +
      token,
    html: `
    <body style="min-height: 70vh;">
      <div 
      style="
        background-color:#007bff;
        height:40px;">
      </div>
      <div style="
        background-color:#343a40;
        color:#f8f9fa;
        padding: 10px;">
        <h3 style="color:#f8f9fa">You can now reset your password at PureOKRs</h3>
        <p
          style="
            color:#f8f9fa;
            "
        >
          Click the following button to reset the password.
        </p>
        <a href="https://www.pureokrs.com/resetpassword/${email}/${token}" 
          style="
            text-decoration:none;
            color:#f8f9fa;
            background-color:#007bff;
            padding: 2px 6px 2px 6px;
            border-radius: 2px;"
        >
          Reset Password
        </a>
      </div>
      <div 
          style="
            background-color:#007bff;
            height:20px;">
      </div>
    </body>
`,
  };
  msg.subject = "You can now reset your password at pureOKRs.";
  msg.to = email;
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  sendgrid.send(msg, (err, doc) => {});
}

export default { sendEmail, sendNewUserEmail, sendResetEmail };
