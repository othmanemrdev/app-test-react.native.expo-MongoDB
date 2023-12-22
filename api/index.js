const express = require('express'); // importer le module Express
const bodyParser = require('body-parser'); // trasformer les requetes en fichier JSON 
const mongoose = require('mongoose'); // permet l'interaction avec des base de données MondoDB avec des schemas
const cors = require('cors'); // utilisé pour autoriser les requêtes provenant de 
                              //domaines différents de celui sur lequel le serveur est hébergé.

const app = express(); // une instance de l'application Express  pour configurer le serveur
const port = 3000; // port sur lequel le serveur écoutera les requêtes (3000 par default) 
app.use(cors()); // activer la prise en charge des requêtes cross-origin

const xSchema = new mongoose.Schema({
  x: String,
});

const X = mongoose.model('x', xSchema);

mongoose.connect('mongodb+srv://othmane:othmane@cluster0.em7ykfi.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection; // référence à l'objet de connexion à la base de données MongoDB

db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
db.once('open', () => {
  console.log('Connecté à MongoDB');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Créer un nouvel x
app.post('/x', async (req, res) => {
  try {
    const { theText } = req.body;
    const newX = new X({ x: theText });
    await newX.save();
    res.json({ success: true, x: newX });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de x:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Récupérer tous les x
app.get('/x', async (req, res) => {
  try {
    const x = await X.find();

    const formattedX = x.map(x => ({
      _id: x._id,
      theText: x.x,
    }));

    res.json({ success: true, x: formattedX });
  } catch (error) {
    console.error('Erreur lors de la récupération des x:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Supprimer un x
app.delete('/x/:id', async (req, res) => {
  try {
    const xId = req.params.id;
    await X.findByIdAndDelete(xId);
    res.json({ success: true, message: 'x supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de x:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});



app.listen(port, () => {
  console.log('Le serveur est en cours d\'exécution sur le port 3000');
});
