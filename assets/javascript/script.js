$(document).ready(function () {

    /* Declare DOM Variables */

    /* Declare JavaScript Variables */

    /* Define Functions */

    /* Make Function Calls */

    /* Register Event Listeners */
    $('#form').on('submit', function (event) {
        event.preventDefault();

        btn.value = 'Sending...';

        const serviceID = 'service_y9qb5eg';
        const templateID = 'template_241tje5';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                btn.value = 'Send Email';
                alert('Sent!');
            }, (err) => {
                btn.value = 'Send Email';
                alert(JSON.stringify(err));
            });
    });

})