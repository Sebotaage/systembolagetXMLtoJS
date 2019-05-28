const convert = require('xml-js');
const xml = require('fs').readFileSync('xml.xml', 'utf8');
const options = {ignoreComment: true, alwaysChildren: true, compact: true};
const result = convert.xml2js(xml, options);
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('./key.json');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://whiskylist-c41a8.firebaseio.com'
});

const db = admin.firestore();


let list = [];
let items = 0;
function addWhisky(){
result.artiklar.artikel.forEach(item => {
	if (item.Varugrupp._text === 'Whisky' && item.Namn._text !== 'null') {
		if (item.Namn2._text === undefined){
			item.Namn2._text = '';
		}
		const whisky = { name: item.Namn._text + ' ' + item.Namn2._text,
		price: item.Prisinklmoms._text,
		volume: item.Volymiml._text,
		type: item.Typ._text,
		origin: item.Ursprung._text,
		alcohol: item.Alkoholhalt._text,
		id: item.Varnummer._text }

		Object.keys(whisky).forEach(data => {
			if (whisky[data] === undefined) {
				whisky[data] = 'x'
			}
		})
		items++;
		list.push({name: item.Namn._text + ' ' + item.Namn2._text, id: item.Varnummer._text});
		db.collection('Whiskys').doc(item.Varnummer._text).set(whisky);
	}
});
db.collection('WhiskyList').doc('List').set({list}, {merge: true});
}
addWhisky();


console.log(`${items} items added`);


