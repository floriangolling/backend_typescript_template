interface MiddlewareUser {
  id: number;
  email: string;
}

// biome-ignore lint: no-namespace
declare namespace Express {
  interface Request {
    user?: MiddlewareUser;
  }
}
