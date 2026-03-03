const express = require('express');
const app = express();

app.use(express.json());

const interviewRoutes = require('./routes/interview');
app.use('/api/interview', interviewRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});