const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'PLACE_SECRET_KEY_HERE';

const hubspotApi = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  }
});

app.get('/', async (req, res) => {
  try {
    const response = await hubspotApi.get(`/crm/v3/objects/2-143055021?properties=name,power,brand`);
    const records = response.data.results;
    res.render('homepage', {
      title: 'Custom Object table',
      records
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('Error during retrieve cars.');
  }
});

app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

app.post('/update-cobj', async (req, res) => {
  const { name, power, brand } = req.body;

  try {
    await hubspotApi.post(`/crm/v3/objects/2-143055021`, {
      properties: { name, power, brand }
    });
    res.redirect('/');
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('Error updating car.');
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));