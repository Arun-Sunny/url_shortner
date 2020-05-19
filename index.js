const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose")
const port = "8000";
const Urls = require('./models/urls.js');
const md5 = require('md5');
let bodyParser = require('body-parser')
app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))

mongoose.connect('mongodb://localhost/urlShortner', {
    useNewUrlParser: true
})
app.set('view engine', 'ejs')
app.get("/", async (req, res) => {
    let shortenedUrls = await Urls.find({});
    // urls
    // res.sendFile(path.join(__dirname + '/views/index.html')); 
    let newTime = new Date().getTime();
    // shortenedUrls.forEach((element)=>{
    //     let oldTime = new Date(element.time).getTime()
    //     // element.time  = (date - new Date(element.time).getTime())/3600000;
    //     element.timeDifference = (newTime - oldTime)/3600000;
    // });
    res.render('index', { shortenedUrls: shortenedUrls });
});

app.post("/shrinkurl", async (req, res) => {
    try {
        let hash = Buffer.from(md5(req.body.initurl)).toString('base64');
        let shortenedUrl = hash.slice(0, 3) + hash.slice(41);
        let urls = await Urls.find({ shortened: shortenedUrl });
        let date = new Date();
        console.log(urls)
        if (urls.length) {
            console.log('Shortened URLS already exist')
        }
        else {
            await Urls.create({ fullUrl: req.body.initurl, shortened: shortenedUrl,creationTime:date,lastVisited:date })
        }
        console.log('shortned url is', shortenedUrl);
        res.redirect('/');

    } catch (error) {
        console.log(`an error has occured. error:${error}`)
        throw error;
    }
})

app.get("/:shortUrl", async (req, res) => {
    try {
        let url = await Urls.findOne({ shortened: req.params.shortUrl });
        url.visits += 1;
        let date = new Date();
        url.lastVisited = date;
        let time = date.getTime()/3600000;
        let oldTime = new Date(url.lastVisited)/3600000;
        let timeDiff = time - oldTime;
        if (timeDiff<1)
        {
            url.clicksPerHour+= 1;
        }
        else 
        {
            url.clicksPerHour= 0;
        }
        url.save();
        res.redirect(url.fullUrl);
    } catch (error) {
        console.log(`an error has occured. error:${error}`)
        throw error;
    }
})

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
// 2020-05-19 09:35:59.162Z