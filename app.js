const express = require('express');
const port = 80;

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, onValue, get, child, remove} = require('firebase/database');
const bodyParser = require('body-parser');


const firebaseConfig = {
  apiKey: "AIzaSyCP_0hKxMychNVPfFeozLAytkurhZ6B8Cg",
  authDomain: "ithopital.firebaseapp.com",
  databaseURL: "https://ithopital-default-rtdb.firebaseio.com",
  projectId: "ithopital",
  storageBucket: "ithopital.appspot.com",
  messagingSenderId: "513901096082",
  appId: "1:513901096082:web:449e1809ecbf7c7d860a4b",
  measurementId: "G-WDFCQQ7JX7"
};

const app2 = initializeApp(firebaseConfig);
const database = getDatabase(app2);
const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, Worldasdsa!' });
});

//for medicine
async function getLastID() {
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `admin/medicine/data`));
        if (snapshot.exists()) {
            return snapshot.val().length;
        } else {
            return 0;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function insertMedicine(id, category, name, price, brand, qty, status){
    set(ref(database, 'admin/medicine/data/' + id), {
    name: name,
    category : category,
    id : id,
    price : price,
    product_brand : brand,
    status : status,
    qty : qty
    });
    console.log("Medicine id "+id+" have been create!");
}

async function removeMedicine(id){
    remove(ref(database, 'admin/medicine/data/' + id));
    console.log("Medicine id "+id+" have been remove!");
}

app.post('/api/remove-medicine', async (req, res) =>{
    await removeMedicine(req.body.id);
    res.status(200).json({ message: "Medicine removed successfully" });
})

app.post('/api/add-medicine', async (req, res) =>{
	let id = await getLastID();
    const {id_cr, product_name, product_brand, price, qty, category } = req.body;
    if(id_cr != 0){id = id_cr;}
	await insertMedicine(id,category,product_name,"$"+price,product_brand,qty,1);
	res.status(200).json({ message: "Medicine added successfully" });
});
//end for medicine

//for machine

async function getLastIDMachine() {
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `admin/machine/data`));
        if (snapshot.exists()) {
            return snapshot.val().length;
        } else {
            return 0;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function insertMachine(id, period, name, price, brand, position, status){
    set(ref(database, 'admin/machine/data/' + id), {
    name: name,
    period : period,
    id : id+1,
    price : price,
    product_brand : brand,
    status : status,
    position : position
    });
    console.log("Machine id "+id+" have been create!");
}

async function removeMachine(id){
    remove(ref(database, 'admin/machine/data/' + id));
    console.log("Machine id "+id+" have been remove!");
}

app.post('/api/remove-machine', async (req, res) =>{
    await removeMachine(req.body.id);
    res.status(200).json({ message: "Machine removed successfully" });
})

app.post('/api/add-machine', async (req, res) =>{
	let id = await getLastIDMachine();
    const {id_cr, product_name, product_brand, price, pos, period } = req.body;
    if(id_cr != 0){id = id_cr;}
	await insertMachine(id,period,product_name,"$"+price,product_brand,pos,1);
	res.status(200).json({ message: "Machine added successfully" });
});

//end for machine


app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => { return res.render('index'); });
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

