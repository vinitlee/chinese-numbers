// Load the SDK and UUID
const AWS = require('aws-sdk');
const Fs = require('fs')
const uuid = require('node-uuid');

// Create an Polly client
const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'us-east-1'
})

let units = {
  "":"",
  "元":"yuan",
  "块":"kuai",
  "年":"nen",
  "个":"ge"
}

let params = {
  'Text': '',
  'OutputFormat': 'mp3',
  'VoiceId': 'Zhiyu',
  'TextType':'ssml'
}

sayPhrase = phrase => {
  var newParams = params;
  newParams.Text = phrase
  
  // console.log(phrase);
  
  Polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
        console.log(err.code)
    } else if (data) {
        if (data.AudioStream instanceof Buffer) {
            Fs.writeFile("./speech.mp3", data.AudioStream, function(err) {
                if (err) {
                    return console.log(err)
                }
                console.log("The file was saved!")
            })
        }
    }
  })
}

sayRandomNumerical = () => {
  let unit = Object.keys(units)[Math.floor(Math.random() * Object.keys(units).length)]
  let unitTranslation = units[unit]

  let number = Math.floor(Math.random() * 1000)

  console.log(String(number) + unitTranslation)

  let saidPhrase = number + unit
  if (number == 2 && unit == "个") { number = "两" }

  sayPhrase("<speak><prosody rate='80%'>" + saidPhrase + "</prosody></speak>")
}

sayRandomNumerical();
// sayPhrase("2个饺子")