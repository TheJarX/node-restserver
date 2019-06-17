// ============================
//  Port
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Enviroment
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



// ============================
//  DB
// ============================
// let urlDb = process.env.NODE_ENV =='dev'?
            // 'mongodb://localhost:27017/cafe':
            let urlDb = 'mongodb+srv://unclejoe:rEsgvsAUpRt2RlAm@cluster0-lbzdk.mongodb.net/cafe';

process.env.URLDB = urlDb;
