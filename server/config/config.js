// ============================
//  Port
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Enviroment
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
// ExpiresIn
// ============================
process.env.EXPIRES_TOKEN = 60 * 60 * 24 * 30;

// ============================
// Token Seed
// ============================

process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'token_dev_seed';

// ============================
//  DB
// ============================
let urlDb = process.env.NODE_ENV =='dev'?
            'mongodb://localhost:27017/cafe':
            process.env.MONGO_URI;

process.env.URLDB = urlDb;
