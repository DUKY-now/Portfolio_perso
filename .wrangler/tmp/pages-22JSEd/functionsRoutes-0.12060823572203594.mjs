import { onRequest as __api_games_js_onRequest } from "D:\\DEV\\Portfolio_perso\\functions\\api\\games.js"

export const routes = [
    {
      routePath: "/api/games",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_games_js_onRequest],
    },
  ]