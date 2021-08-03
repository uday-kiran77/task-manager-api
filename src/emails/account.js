const sgMail= require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'udaykiran.7889@gmail.com',
        subject:'Thanks for Joining Us!',
        text:`Welcome to the task-manager app,${name}.`

    })
}

const sendDeleteEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'udaykiran.7889@gmail.com',
        subject:'Good Bye.',
        text:`Hello ${name}, We just recieved your request to delete your account with our task manager app and please leave a feedback that how was your expreience with our app.`
    })
}

module.exports={
    sendWelcomeEmail,
    sendDeleteEmail
}
