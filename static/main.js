var socket = io.connect();

window.addEventListener("beforeunload", function (event) {
    socket.close()
});

socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});

var a = new Audio();
socket.on('tts', data => {
    console.log('Playing audio for ' + data.text);
    a.src = data.audio;
    a.load();
    a.play();
});

let units = {
    "":"",
    "元":"yuan",
    "块":"kuai",
    "年":"nen",
    "个":"ge"
}

let range = [0,1000]

var currentChallenge = {
    text: "",
    num: 0,
    ready: false
};
function makeChallenge() {
    const number = Math.floor(Math.random() * (range[1] - range[0]) + range[0])
    const unit = Object.keys(units)[Math.floor(Math.random() * Object.keys(units).length)]
    var text = number + unit
    
    socket.emit('requestTts',text);

    // appendNum(text,(Math.random() < 0.8));
    currentChallenge.text = text;
    currentChallenge.num = number;
    currentChallenge.ready = true;
    console.log("=>" + text);
}

function appendNum(num,correct) {
    var el = $('<li>').append(num).addClass(correct?'right':'wrong');
    $('#challenges ul').append(el);
}

function submitAnswer() {
    if (currentChallenge.ready && $('#answer').val()) {
        let answer = $('#answer').val();
        $('#answer').val('');
        console.log(answer + "||" + currentChallenge.text);

        appendNum(currentChallenge.text,currentChallenge.num == answer);

        currentChallenge.ready = false;

        makeChallenge();
    }
    else {
        console.log("The input in empty.");
    }
}

$(window).keypress(e => {
    if (e.charCode == 13) {
        submitAnswer();
    }
});

$('#repeat').click(e => {
    a.currentTime = 0;
    a.play();
    $('#answer').focus();
});

makeChallenge();

//Test
// for (var i=0;i<10;i++) {
//     makeChallenge();
// }

/*
## Metrics
Errors per numeral
Errors corr. with # of digits
Time to answer/get right
*/