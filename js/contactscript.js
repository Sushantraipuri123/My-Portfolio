function sendMsg() {
    let number = "+917876135383";
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let subject = document.getElementById('subject').value;
    let message = document.getElementById('message').value;

    // Validate if all fields are filled
    if (!name || !email || !subject || !message) {
        alert("Please fill in all fields before sending the message.");
        return false; // Prevent opening WhatsApp URL if validation fails
    }

    var url = "https://wa.me/" + number + "?text="
        + "Name: " + name + "%0a"
        + "E-mail: " + email + "%0a"
        + "Subject: " + subject + "%0a"
        + "Message: " + message + "%0a%0a";

    window.open(url, '_blank').focus();
}