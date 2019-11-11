import app from './app';
// const port = process.env.FLIGHT_PORT || 4500;
const port = 4500;

app.listen(port);
console.log(`listening on http://localhost:${port}`);
