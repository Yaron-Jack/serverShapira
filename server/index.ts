import app from './server';
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server available on http://localhost:${PORT}/`);
});
