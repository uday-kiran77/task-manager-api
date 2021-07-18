const sgMail= require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'udaykiran.7889@gmail.com',
        subject:'Thanks for Joining Us!',
        text:`Welcome to the task-manager app,${name}. Let us know your experience.`

    })
}

const sendDeleteEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'udaykiran.7889@gmail.com',
        subject:'Good Bye.',
        text:`Goodbye ${name},Please provide a feedback on our app and gope that uou specify a reason for leaving us`
    })
}

module.exports={
    sendWelcomeEmail,
    sendDeleteEmail
}