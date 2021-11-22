import { IUser } from "../models/user";

export class Okr {
  _id?: string;
  objective: string;
  keyResults: KeyResult[];
  parent: string;
  children: string[];
  evaluation: string;
  userId: string;
  user?: IUser;
  company: string;

  constructor(
    obj: string,
    keyRes: KeyResult[] = [],
    parent: string = "",
    children: string[] = [],
    evaluation: string = "",
    userId: string = "",
    company: string = "",
    user?: IUser
  ) {
    this.objective = obj;
    this.keyResults = keyRes;
    this.parent = parent;
    this.children = children;
    this.evaluation = evaluation;
    this.userId = userId;
    this.user = user;
  }
}

export class KeyResult {
  _id?: string;
  keyResult: string;
  progress: number;
  score: number;
  evaluation: string;

  constructor(
    keyResult: string,
    progress: number = 0,
    score: number = 0,
    evaluation: string = ""
  ) {
    this.keyResult = keyResult;
    this.progress = progress;
    this.score = score;
    this.evaluation = evaluation;
  }
}
