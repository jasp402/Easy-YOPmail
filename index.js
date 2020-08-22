const YOPmail  = require('./lib');
let express = require('express');
let app  = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res)=>{
    res.end('init')
});

app.get('/api/getmail', function (req, res) {
    const petition = YOPmail.createMail();
    petition.then(response => {
        res.send(response);
    })
});

app.get('/api/getinbox/:mail', function (req, res) {
    let email = undefined;
    let query = '';
    if((req.params.mail).indexOf('@')>-1){
        email = req.params.mail.split('@')[0]
    }
    else{
        email = req.params.mail
    }

    if(Object.keys(req.query).length > 0){
        let queryKey = Object.keys(req.query)[0];
            query = req.query[queryKey];
    }

    const petition = YOPmail.inbox(email, query);
    petition.then(response => {
        res.end(JSON.stringify(response, null, ' '));
    });
});

app.get('/api/readmail/:mail/:id', function (req, res) {
    let url = 'http://m.yopmail.com/en/m.php?';
    if(req.params.mail && req.params.id){
        url += `b=${req.params.mail}&id=${req.params.id}`
    }else{
        res.end('error! require mail and id');
    }
    console.log(url);
    const petition = YOPmail.readMail(url);
    petition.then(response => {
        res.end(response);
    })
});

app.listen(port, function () {
    console.log('Example app listening on port:', port);
});
