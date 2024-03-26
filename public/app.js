const express = require('express');
const app = express();
const port = 80;
const admin = require('firebase-admin')
admin.initializeApp();

app.get('/api/admin/medicine', (req, res) => {
// Lấy tham chiếu đến nút 'products' trong Firebase Realtime Database
const productsRef = admin.database().ref('admin/medicine');
// Lấy dữ liệu từ Firebase Realtime Database
productsRef.once('value', (snapshot) => {
    const products = snapshot.val();
    // Trả về dữ liệu dưới dạng JSON
    res.json(products);
}, (errorObject) => {
    // Xử lý lỗi nếu có
    console.error('Đọc dữ liệu từ Firebase Realtime Database thất bại: ' + errorObject.code);
    res.status(500).json({ error: 'Lỗi khi đọc dữ liệu từ cơ sở dữ liệu.' });
});
});

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => { return res.render('index'); });
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

