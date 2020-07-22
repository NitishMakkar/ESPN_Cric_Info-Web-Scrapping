// install => npm install request
// import
let request = require("request");
let xlsx = require("xlsx");
let path = require("path");
// let url = "https://www.espncricinfo.com/series/8039/scorecard/656495/australia-vs-new-zealand-final-icc-cricket-world-cup-2014-15";
let fs = require("fs");
let cheerio = require("cheerio");
function matchHandler(url) {

    request(url, cb);
}

function cb(err, header, body) {
    // request is successfully processed
    if (err == null && header.statusCode == 200) {
        console.log("recieved Response");
        // console.log("Html recieved");
        parseHtml(body);
        // fs=> file system
        // fs.writeFileSync("page.html", body);
    } else if (header.statusCode == 404) {
        console.log("Page Not found");
    } else {
        console.log(err);
        console.log(header);
    }

}
function parseHtml(body) {
    // parse => $=> selector => element search and bring you that element
    let $ = cheerio.load(body);
    // class => .desc.
    // id => #name
    let venuElem = $(".desc.text-truncate");
    let venue = venuElem.text().trim();
    let rsElem = $(".summary span");
    let result = rsElem.text().trim();
    // element matching with this desc=>  clas=> card ,content,match-scorecard-table  inside that it has Collapsible
    let bothInnings = $(".card.content-block.match-scorecard-table .Collapsible");
    // console.log(bothInnings.length);
    console.log("``````````````````````````````")

    for (let i = 0; i < bothInnings.length; i++) {
        let teamNameElem = $(bothInnings[i]).find("h5");
        let teamName = teamNameElem.text().split("Innings");
        teamName = teamName[0].trim();
        console.log(teamName);
        let AllRows = $(bothInnings[i]).find(".table.batsman tbody tr");
        // console.log(AllRows.length);
        for (let j = 0; j < AllRows.length; j++) {
            let allcols = $(AllRows[j]).find("td");
            let isPlayer = $(allcols[0]).hasClass("batsman-cell");
            if (isPlayer) {
                // player row
                let pName = $(allcols[0]).text().trim();
                let runs = $(allcols[2]).text().trim();
                let balls = $(allcols[3]).text().trim();
                let sixes = $(allcols[5]).text().trim();
                let fours = $(allcols[6]).text().trim();
                let sr = $(allcols[7]).text().trim();
                // console.log(pName);
                console.log(teamName+" "+ pName+" "+ runs+" "+ balls+" "+ sixes+" " +fours+" " +sr);
            }
        }
        console.log("###################");
    }

    console.log("*****************************************");
}


module.exports.expfn = matchHandler;