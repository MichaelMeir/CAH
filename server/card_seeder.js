require("dotenv").config();
const orm = require("orm");
const uuidv4 = require("uuid/v4");
const progress = require("progress");
const request = require("request");
const brotli = require("brotli/decompress");
const https = require("https");
const fs = require('fs')
const { TextDecoder } = require('util')
const { decompressStream } = require('iltorb')

orm.connect(
	`mysql://${process.env.MYSQL_USERNAME}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}/${process.env.MYSQL_DATABASE}`,
	(err, db) => {
		if (err) throw err;
		const cardpack = db.define("cardpacks", {
			uuid: String,
			user_id: Number,
			likes: Number,
			name: String,
			description: { type: "text", size: 255 },
			tags: String,
			cardAmount: Number,
		});

		const card = db.define("cards", {
			uuid: String,
			text: { type: "text", size: 255 },
			white: Boolean,
			picks: Number,
			cardpack_id: Number
        });
        
        card.hasOne('cardpack', cardpack, { reverse: 'cards', autoFetch: true })

		db.sync(err => {
            if (err) throw err;
            console.log("Downloading Brotli file containing data...")
			getJson(() => {
                console.log('Downloaded Brotli file to ./.temp.json.br')
                console.log('Parsing file...')
                const result = brotli(fs.readFileSync('./.temp.json.br'));
                console.log("Decoding to utf-8...")
                const decoded = new TextDecoder("utf-8").decode(result)
                console.log('Parsing from json...')
				seed(decoded, {
					cardpack,
					card
                });
            });
		});
	}
);

const getJson = callback => {
    var headers = {
        'Connection': 'keep-alive',
        'Content-Length': '1384',
        'Host': 'crhallberg.com',
        'Postman-Token': '8081718d-78cb-4fdd-929b-ba272120e593,786d1445-f21e-4167-baa7-e1df4182822f',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,nl;q=0.7',
        'authority': 'crhallberg.com',
        'cache-control': 'max-age=0,no-cache',
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://crhallberg.com',
        'referer': 'https://crhallberg.com/cah/',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'curl/7.47.0',
        'Cookie': '__cfduid=d5ab3ac90dfca489fe6e97246c52b803c1570179272'
    };
    
    var dataString = 'decks%5B%5D=Base&decks%5B%5D=CAHe1&decks%5B%5D=CAHe2&decks%5B%5D=CAHe3&decks%5B%5D=CAHe4&decks%5B%5D=CAHe5&decks%5B%5D=CAHe6&decks%5B%5D=greenbox&decks%5B%5D=90s&decks%5B%5D=Box&decks%5B%5D=fantasy&decks%5B%5D=food&decks%5B%5D=science&decks%5B%5D=www&decks%5B%5D=hillary&decks%5B%5D=trumpvote&decks%5B%5D=trumpbag&decks%5B%5D=xmas2012&decks%5B%5D=xmas2013&decks%5B%5D=PAXE2013&decks%5B%5D=PAXP2013&decks%5B%5D=PAXE2014&decks%5B%5D=PAXEP2014&decks%5B%5D=PAXPP2014&decks%5B%5D=PAX2015&decks%5B%5D=HOCAH&decks%5B%5D=reject&decks%5B%5D=reject2&decks%5B%5D=Canadian&decks%5B%5D=misprint&decks%5B%5D=apples&decks%5B%5D=crabs&decks%5B%5D=matrimony&decks%5B%5D=c-tg&decks%5B%5D=c-admin&decks%5B%5D=c-anime&decks%5B%5D=c-antisocial&decks%5B%5D=c-equinity&decks%5B%5D=c-homestuck&decks%5B%5D=c-derps&decks%5B%5D=c-doctorwho&decks%5B%5D=c-eurovision&decks%5B%5D=c-fim&decks%5B%5D=c-gamegrumps&decks%5B%5D=c-golby&decks%5B%5D=GOT&decks%5B%5D=CAHgrognards&decks%5B%5D=HACK&decks%5B%5D=Image1&decks%5B%5D=c-ladies&decks%5B%5D=c-imgur&decks%5B%5D=c-khaos&decks%5B%5D=c-mrman&decks%5B%5D=c-neindy&decks%5B%5D=c-nobilis&decks%5B%5D=NSFH&decks%5B%5D=c-northernlion&decks%5B%5D=c-ragingpsyfag&decks%5B%5D=c-stupid&decks%5B%5D=c-rt&decks%5B%5D=c-rpanons&decks%5B%5D=c-socialgamer&decks%5B%5D=c-sodomydog&decks%5B%5D=c-guywglasses&decks%5B%5D=c-vewysewious&decks%5B%5D=c-vidya&decks%5B%5D=c-xkcd&type=JSON';
    
    var options = {
        agent: https.Agent({keepAlive: true}),
        url: 'https://crhallberg.com/cah/output.php',
        method: 'POST',
        headers: headers,
        gzip: true,
        brotliDecompress: decompressStream,
        body: dataString
    };
    let file = fs.createWriteStream(`./.temp.json.br`)
	request(options).pipe(file).on('finish', callback);
};

const seed = (raw, models) => {
	let parsed = null;
	try {
		parsed = JSON.parse(raw);
	} catch (e) {
		console.log("Failed to parse to json");
        console.error(e);
        return
    }

	if (parsed.blackCards && parsed.whiteCards && parsed.order) {
		var bar = new progress(
			"adding cards [:bar] :rate/cards per second :percent :etas",
			{
				complete: "|",
				incomplete: ":",
				width: 20,
                total: parsed.blackCards.length + parsed.whiteCards.length,
                callback: () => {
					console.log('Removing ./.temp.json.br')
					fs.unlinkSync('./.temp.json.br')
					console.log('COMPLETED: successfully seeded default cards and cardpacks!')
					process.exit(0)
                }
			}
		);
		for (let i = 0; i < parsed.order.length; i++) {
			const details = parsed[parsed.order[i]];
			models.cardpack.create(
				{
					uuid: uuidv4(),
					user_id: null,
					likes: 0,
					name: details.name,
					description: "Default pack: " + details.name,
					tags: `["Default"]`,
					cardAmount: details.black.length + details.white.length,
				},
				(err, result) => {
					if (err) throw err;
					seedCards(
                        result,
						result.id,
						parsed.blackCards,
						parsed.whiteCards,
						details,
						models,
						bar,
                    );
				}
			);
			wait
		}
	}
};

const seedCards = (
    cardpack,
	cardpackId,
	blackCards,
	whiteCards,
	details,
	models,
	bar,
) => {
	for (let i = 0; i < details.white.length; i++) {
		const card = whiteCards[details.white[i]];
		models.card.create(
			{
				uuid: uuidv4(),
				text: card,
				white: true,
				picks: 0,
				cardpack_id: cardpackId
			},
			(err, result) => {
				bar.tick(1);
				if (err) {
					console.log(
						'failure while adding white card: "' +
							card +
							'" in pack: #' +
							cardpackId
					);
				}else{
                    addCard(cardpack, result)
                }
			}
		);
	}
	for (let i = 0; i < details.black.length; i++) {
		const card = blackCards[details.black[i]];
		models.card.create(
			{
				uuid: uuidv4(),
				text: card.text,
				white: false,
				picks: card.pick,
				cardpack_id: cardpackId
			},
			(err, result) => {
				bar.tick(1);
				if (err) {
					console.log(
						'failure while adding black card: "' +
							card.text +
							'" in pack: #' +
							cardpackId
					);
				}else{
                    addCard(cardpack, result)
                }
			}
		);
	}
};

const addCard = (cardpack, card, callback) => {
    cardpack.getCards((err, result) => {
        if(err) {
            console.error(err)
            return
        }
        cardpack.setCards(...result, card, (err, res) => {
            if(err) {
                console.error(err)
                return
			}
			callback()
		})
    })
} 