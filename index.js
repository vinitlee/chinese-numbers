const AWS = require('aws-sdk');
const Fs = require('fs');

const crypto = require('crypto')

const path = require('path')

const express = require('express')
const app = express();
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);
const port = 3000

const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1'
})

app.use('/', express.static('static'))

server.listen(port, () => console.log(`Listening on port ${port}!`))

// HTTP --------------
// const httpServer = http.createServer();
// server.on('request', (request, response) => {
//     // the same kind of magic happens here!
//   });


// Socket.IO ---------
io.on('connection', socket => {
    console.log("O " + socket.id);
    socket.on('disconnect', () => {
        console.log("X " + socket.id)

        const directory = "./static/audio/";
        Fs.readdir(directory, (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
              Fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
              });
            }
          });
    });

    // socket.on('private message', (from, msg) => {
    //     console.log('I received a private message by ', from, ' saying ', msg);
    // });

    socket.on('settings', () => {
        // Modify settings object
        // Speed
        // Number range
        // Numerals
    });

    let defaultParams = {
        'Text': '',
        'OutputFormat': 'mp3',
        'VoiceId': 'Zhiyu',
        'TextType':'ssml'
    }

    socket.on('requestTts', msg => {
        console.log('New TTS data requested for ' + msg);

        params = defaultParams;
        params.Text = "<speak><prosody rate='80%'>" + msg + "</prosody></speak>"

        Polly.synthesizeSpeech(params, (err, data) => {
            const hash = crypto.randomBytes(8).toString('hex');

            if (err) {
                console.log(err.code)
            } else if (data) {
                if (data.AudioStream instanceof Buffer) {
                    Fs.writeFile("./static/audio/"+hash+".mp3", data.AudioStream, function(err) {
                        if (err) {
                            return console.log(err)
                        }
                        console.log("The file was saved!")
                    })
                }

                packet = {
                    text:msg,
                    audio:"audio/"+hash+".mp3"
                }
                socket.emit('tts',packet)
            }
        })

    });
});