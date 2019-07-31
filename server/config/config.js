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
process.env.EXPIRES_TOKEN = '48h';

// ============================
// Token Seed
// ============================

process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'token_dev_seed';

// ============================
//  DB Config
// ============================
let urlDb = process.env.NODE_ENV == 'dev' ?
    'mongodb://localhost:27017/cafe' :
    process.env.MONGO_URI;

process.env.URLDB = urlDb;

// ============================
// Google Client ID (el mio)
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '233238598966-f89q1p09oflv3apbhtt6o0lh4dvjivq3.apps.googleusercontent.com';