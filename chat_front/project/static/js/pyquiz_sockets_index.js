function send_answer(response) {
    console.log("Enviado respuesta "+response);
    socket.emit('send_answer', {"question": $("#question-id").val(), "answer": response});
}
function start_user_channel(userId, person) {
    console.log("escuchando en " + userId);
    socket.on(userId, function (data) {
        console.log("RESULTADOS:");
        console.log(data);
        $('#msg').text(data);
    });
}
$(document).ready(function () {


    socket.on('questions', function (data) {
        console.log(data);
        $("#start-off").css("display", "none");
        $("#start-on").css("display", "block");
        $('#question-id').val(data.active_question_id);
        $('#question-title').text(data.question.title);
        $('#question-answers').text("");
        $('#question-buttons').text("");
        index = 1;

        for (var answer_id in data.question.answers) {
            console.log(answer_id);
            $('#question-answers').append('<div style="margin-bottom: 5px;">' + index + ') ' + data.question.answers[answer_id] + '</div>');
            $('#question-buttons').append('<div class="col s12 m3" style="margin-bottom: 20px;">' +
                '<button id="answer-' + index + '" data-value="'+answer_id+'" class="btn-large waves-effect waves-light orange">Respuesta ' + index + '</button>' +
                '</div>');

            index++;
        }
        $('#msg').text("");
    });
    socket.on('message', function (data) {
        if (data.welcome) {
            $('#msg').text(data.welcome + " " + data.userId + "!!");
            var person = prompt("Please enter your name", "Harry Potter");
            start_user_channel(data.userId, person);
        } else {
            $('#msg').text(data.message);
        }
        $('#modal1').modal('open');
    });
});