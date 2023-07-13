import Express, { json } from "express";
import { JWTAuthHandler } from "./middleware/auth.middleware";
import { DefaultErrorHandler } from "./middleware/error-handler.middleware";
import { ROUTES_AUTH } from "./routes/Auth";
import { ROUTES_USER_ADMIN } from "./routes/User";
import { ROUTES_PROMO } from "./routes/Promo";
import { ROUTES_USER_SESSION } from "./routes/SessionUser";
import { ROUTES_USER } from "./routes/User";
import { ROUTES_QUESTION } from "./routes/Question";
import { ROUTES_SCORE, ROUTES_SCORE_ADMIN, ROUTES_SCORE_PUT} from "./routes/Score";
import { ROUTES_ADMIN_SESSION } from "./routes/SessionAdmin";
import { controllerTests } from "./middleware/tests";
import { controllerQuestionsTests } from "./routes/QuestionTests";

// Récupérer le port des variables d'environnement ou préciser une valeur par défaut
const PORT = process.env.PORT || 5050;

// Créer l'objet Express
const app = Express();

// L'appli parse le corps du message entrant comme du json
app.use(json());

// Accrocher les routes
app.use('/challenge/auth', ROUTES_AUTH)

// USER

//check
app.use('/challenge/admin/user',
  JWTAuthHandler("admin"),  
  ROUTES_USER_ADMIN
);

//check
app.use('/challenge/user',
  JWTAuthHandler("user"),  
  ROUTES_USER
);

// PROMO

//check
app.use('/challenge/promo',
  JWTAuthHandler("admin"),
  ROUTES_PROMO)

//CHALLENGE - session

//check
app.use('/challenge/user/session', 
JWTAuthHandler("user"),
ROUTES_USER_SESSION)

//check
app.use('/challenge/admin/session', 
JWTAuthHandler("admin"),
ROUTES_ADMIN_SESSION)

// QUESTIONS

//check
app.use('/challenge/questions', 
  JWTAuthHandler("user"),
ROUTES_QUESTION)

// SCORE

//check
app.use('/challenge/score', 
  JWTAuthHandler("user"), 
  ROUTES_SCORE)

//check
app.use('/challenge/admin/session/score', 
  JWTAuthHandler("admin"), 
ROUTES_SCORE_ADMIN)

//check
app.use('/challenge/score/test/:id_score', 
  JWTAuthHandler("user"), 
  controllerQuestionsTests,
  controllerTests,
ROUTES_SCORE_PUT)


app.use(DefaultErrorHandler);

// Lancer le serveur
app.listen(PORT,
  () => {
    console.info("API Listening on port " + PORT);
  }
);
