const express = require('express')
const app = express()
var cors = require('cors')
const port = 8081
app.use(cors())
const axios = require('axios').default;
const multer  = require('multer')
const upload = multer()



const projectId = 'pruebas-81b21';
const location = 'global';
const {TranslationServiceClient} = require('@google-cloud/translate')
const translationClient = new TranslationServiceClient();


app.post('/api/auth', (req, res) => {
    res.send({"custom":false})
})

app.post('/api/plugin', upload.none(),(req, res) => {
    console.log(req.body);

    const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [req.body.q],
        mimeType: 'text/plain', // mime types: text/plain, text/html
        sourceLanguageCode: 'es-ES',
        targetLanguageCode: 'pt-BR',
    };

    translationClient.translateText(request)
        .then(data=>{
            let textoTraducido=data[0].translations[0].translatedText;
            console.log(textoTraducido)
            let texto=textoTraducido
            axios.post(
                'https://translation-v3.handtalk.me/api/plugin', "------WebKitFormBoundary2NhBFT5CnZCuQyuT\r\nContent-Disposition: form-data; name=\"mode\"\r\n\r\ndefault\r\n------WebKitFormBoundary2NhBFT5CnZCuQyuT\r\nContent-Disposition: form-data; name=\"token\"\r\n\r\n894ad581fb6306c7363cb9c32a5dd9dd\r\n------WebKitFormBoundary2NhBFT5CnZCuQyuT\r\nContent-Disposition: form-data; name=\"q\"\r\n\r\n"+texto+"\r\n------WebKitFormBoundary2NhBFT5CnZCuQyuT\r\nContent-Disposition: form-data; name=\"subtype\"\r\n\r\ntext\r\n------WebKitFormBoundary2NhBFT5CnZCuQyuT\r\nContent-Disposition: form-data; name=\"uid\"\r\n\r\nundefined\r\n------WebKitFormBoundary2NhBFT5CnZCuQyuT--\r\n",
                {
                    headers: {
                        "accept": "*/*",
                        "accept-language": "es-ES,es;q=0.9",
                        "cache-control": "no-cache",
                        "content-type": "multipart/form-data; boundary=----WebKitFormBoundary2NhBFT5CnZCuQyuT",
                        "key": "2b28e79b5d5ee2c3d6b1a531c2d1d316",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Google Chrome\";v=\"95\", \"Chromium\";v=\"95\", \";Not A Brand\";v=\"99\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                        "Referer": "https://docs.handtalk.me/",
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    }
                })
                .then(function (response) {
                    res.send(response.data)
                    //console.log(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        })


})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})




