import Express, { json } from "express";
import { JWTAuthHandler } from "./middleware/auth.middleware";
import { DefaultErrorHandler } from "./middleware/error-handler.middleware";
import { ROUTES_AUTH } from "./routes/Auth";
import { ROUTES_USER } from "./routes/User";
import { ROUTES_PROMO } from "./routes/Promo";
import { ROUTES_UCHALLENGE } from "./routes/Challenge";
import { ROUTES_QUESTION } from "./routes/Question";
import { ROUTES_SCORE } from "./routes/IScore";
import { ROUTES_INSTANCE } from "./routes/Instance";
import { ROUTES_ACHALLENGE } from "./routes/ChallengeAdmin";
import { controllerTests } from "./middleware/tests";
import { controllerQuestionsTests } from "./routes/QuestionTests";

// Récupérer le port des variables d'environnement ou préciser une valeur par défaut
const PORT = process.env.PORT || 5050;

// Créer l'objet Express
const app = Express();

// L'appli parse le corps du message entrant comme du json
app.use(json());

app.use('/challenge/score', 
  JWTAuthHandler("user"), 
  controllerQuestionsTests,
  controllerTests)

// Accrocher les routes
app.use('/challenge/auth', ROUTES_AUTH)
//app.use('/user', ROUTES_USER);

app.use('/challenge/user',
  JWTAuthHandler("admin"),   // Insérer un middleware pour valider que l'utilisateur est bien identifié
  ROUTES_USER
); 

app.use('/challenge/promo',
  JWTAuthHandler("admin"),
  ROUTES_PROMO)

app.use('/challenge/challenge', 
JWTAuthHandler("user"),
ROUTES_UCHALLENGE)

app.use('/challenge/admin/challenge', 
JWTAuthHandler("admin"),
ROUTES_ACHALLENGE)

app.use('/challenge/question', 
  JWTAuthHandler("user"),
  ROUTES_QUESTION)


app.use('/challenge/score', 
  JWTAuthHandler("user"), 
  controllerQuestionsTests,
  controllerTests,
  ROUTES_SCORE)

app.use('/challenge/instance',
JWTAuthHandler("user"), 
  ROUTES_INSTANCE)
// Ajouter un handler pour les erreurs
app.use(DefaultErrorHandler);

// Lancer le serveur
app.listen(PORT,
  () => {
    console.info("API Listening on port " + PORT);
  }
);
