function sendMsg() {
    let number = "+917876135383";

    let  name = document.getElementById('name').value;
    let  email = document.getElementById('email').value;
    let  subject = document.getElementById('subject').value;
    let  message = document.getElementById('message').value;

    var url = "https://wa.me/" +number+ "?text="
    + "Name : " +name + "%0a"
    + "E-mail : " +email + "%0a"
    + "Subject : " +subject + "%0a"
    + "Message : " +message + "%0a%0a";

    window.open(url, '_blank').focus()
}