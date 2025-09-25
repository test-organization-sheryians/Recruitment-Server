const { PORT } = require('./config/environment');
const app = require('./app/index')


app.listen(PORT, () => {
    console.log(`server run on http://localhost:${PORT}`)
})