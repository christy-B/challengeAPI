export interface IQuestion {
    id_question: number;
    question_text: string;
    question_description: string;
    bonne_reponse: string;
    challenge_active: boolean;
    question_score: number
  }
  
  // Outils de manipulation des types :
  // https://www.typescriptlang.org/docs/handbook/utility-types.html
  // Ici, on rend tous les champs "lecture seul". Typescript ne va pas autoriser l'affectation des champs
  export type IQuestionRO = Readonly<IQuestion>;
  
  export type IQuestionCreate = Omit<IQuestion, 'id_question'>;
  
  export type IQuestionUpdate = Partial<IQuestionCreate>;
  