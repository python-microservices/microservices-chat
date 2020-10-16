var namespace = '/chat';
var socket = io.connect(service_host + namespace);

var user_id = "";
var username = "";

function send_msg(response) {
    var msg = {"message": response, "username": username};
    console.log("Enviado mensaje: ");
    console.log(msg);
    socket.emit('send_msg', msg);
}

$(document).ready(function () {
    socket.on('connect', function () {
        console.log("connected");
        $("#start-off").css("display", "none");
        $("#start-on").css("display", "block");
        username = prompt("Introduce tu nick", "Harry Potter");
        socket.emit('log-in', {"username": username});

    });

    socket.on('users_connected', function (lenUsers) {
        $('#user-cnt').text(lenUsers);
        console.log("users connected: " + lenUsers);
    });
    socket.on('msgs', function (data) {
        console.log("llegó mensaje:");
        console.log(data);
        var position = "";
        var username_sender = "";
        var color = "";
        if (data.user_id === user_id || data.username === username) {
            position = "right";
            color = "light-green lighten-4";
        } else {
            color = "grey lighten-5";
            username_sender = '<div>' + data.username + '</div>';
        }
        var msg = '<div class="row ' + color + '">' +
            username_sender +
            '<div class="col  s12 m12" ><p class="' + position + '">' +
            data.message +
            '</p></div></div>';
        $('#msgs').append(msg);

        $('main').scrollTop($('main')[0].scrollHeight);
    });
    $("#send_msg").submit(function (e) {
        e.preventDefault();
        send_msg($("#msg_input").val());
    });
    socket.on('message', function (data) {
        console.log("Message recived");
        console.log(data);
        if (data.welcome) {
            $('#msg').text(data.welcome + "!!");
        } else {
            $('#msg').text(data.message);
        }
        if (data.user_id) {
            user_id = data.user_id;
        }
        $('#modal1').modal('open');
    });

});