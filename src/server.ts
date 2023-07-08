import Express, { json } from "express";
import { JWTAuthHandler } from "./middleware/auth.middleware";
import { DefaultErrorHandler } from "./middleware/error-handler.middleware";
import { ROUTES_AUTH } from "./routes/Auth";
import { ROUTES_USER } from "./routes/User";

// Récupérer le port des variables d'environnement ou préciser une valeur par défaut
const PORT = process.env.PORT || 5050;

// Créer l'objet Express
const app = Express();

// L'appli parse le corps du message entrant comme du json
app.use(json());

// Accrocher les routes
app.use('/challenge/auth', ROUTES_AUTH)
//app.use('/user', ROUTES_USER);

app.use('/challenge/user',
  JWTAuthHandler("admin"),   // Insérer un middleware pour valider que l'utilisateur est bien identifié
  ROUTES_USER
); 


// Ajouter un handler pour les erreurs
app.use(DefaultErrorHandler);

// Lancer le serveur
app.listen(PORT,
  () => {
    console.info("API Listening on port " + PORT);
  }
);
