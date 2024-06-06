const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, html) => {
  const config = {
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "madaissport8@gmail.com",
      pass: "emmw dayn zbvv xnob",
    },
  };

  const mensaje = {
    from: "madaissport8@gmail.com",
    to: [email],
    subject,
    html,
  };

  const transport = nodemailer.createTransport(config);

  const info = await transport.sendMail(mensaje);

  console.log(info);
};

const sendEmailReset = async (recipient_email , OTP ) => {
  const config = {
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "madaissport8@gmail.com",
      pass: "emmw dayn zbvv xnob",
    },
  };

  const mensaje = {
    from: "madaissport8@gmail.com",
    to: [recipient_email],
    subject: "Reestablecimiento de contraseña",
    html: `<!DOCTYPE html>
    <html lang="en" >
    <head>
      <meta charset="UTF-8">
      <title>CodePen - OTP Email Template</title>
      
    
    </head>
    <body>
    <!-- partial:index.partial.html -->
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
      <div style="margin:50px auto;width:70%;padding:20px 0">
        <div style="border-bottom:1px solid #eee">
          <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Madais Sport</a>
        </div>
        <p style="font-size:1.1em">Hola,</p>
        <p>Usa el siguiente código para confirmar su cambio de contraseña</p>
        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
        <hr style="border:none;border-top:1px solid #eee" />
        <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
          <p>Madais Sport Inc</p>
          <p>Villa del Rosario</p>
          <p>Norte de Santander</p>
        </div>
      </div>
    </div>
    <!-- partial -->
      
    </body>
    </html>`,
  };

  const transport = nodemailer.createTransport(config);

  const info = await transport.sendMail(mensaje);

  console.log(info);
};

const getTemplate = (name, token) => {
  return `
  <head>
  <link rel="stylesheet" href="./style.css">
</head>

<div id="email___content">
  <img src="https://res.cloudinary.com/dqkgpkjlm/image/upload/v1715525887/jbc7c5hvetsl56z2an6c.jpg" alt="">
  <h2>Hola ${name}</h2>
  <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
  <a href="https://madaissportecommerce.netlify.app/usuario/confirmar/${token}" target="_blank">
    Confirmar Cuenta
  </a>
</div>
  `;
};

const getTemplate2 = (name) => {
  return `
  <head>
  <link rel="stylesheet" href="./style.css">
</head>

<div id="email___content">
<img src="https://res.cloudinary.com/dqkgpkjlm/image/upload/v1715525887/jbc7c5hvetsl56z2an6c.jpg" alt="" width="300" height="300">
  <h2>Hola ${name}</h2>
  <p>¡Bienvenido a MadaisSport! Estamos emocionados de tenerte como parte de nuestra comunidad deportiva. Gracias por registrarte y confiar en nosotros para ser tu destino favorito de artículos deportivos y no olvides completar sus datos para acceder a beneficios especiales.</p>
</div>
  `;
};


module.exports = {
  sendEmail,
  getTemplate,
  getTemplate2,
  sendEmailReset
};
