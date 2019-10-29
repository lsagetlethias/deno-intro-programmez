import Home from "./page.tsx";
import {
  Application,
  Router,
  RouterContext
} from "https://deno.land/x/oak/mod.ts";
import { App, GuessSafeEnum, generate } from "./misc.ts";

// État global de l'application
const State = {
  isRedirect: false,
  win: false,
  hint: "",
  from: "",
  guess: -1,
  redirect(ctx: RouterContext, to = "/") {
    this.from = ctx.request.url;
    this.isRedirect = true;
    ctx.response.headers.set("Location", to);
    ctx.response.status = 302;
  },
  endRedirect() {
    this.from = "";
    this.isRedirect = false;
  }
};

// Outils générer un random
let rand = {
  generate,
  value: generate(),
  reset() {
    return (this.value = this.generate());
  }
};

// Début application
console.log("guessanumber: Launch server");

// Configuration router
const router = new Router();
router
  .get(App.DEFAULT_ROUTE, ctx => {
    ctx.response.type = ".html";
    ctx.response.body = Home(State);
    State.endRedirect();

    console.log(`guessanumber: Number to guess is ${rand.value}`);
  })
  .get("/guess", ctx => {
    const guess = (State.guess = parseInt(ctx.request.searchParams.get("val")));
    console.log(`guessanumber: ${guess} was suggested`);

    switch (true) {
      case guess > rand.value:
        State.hint = "less";
        break;
      case guess < rand.value:
        State.hint = "more";
        break;
      case guess === rand.value:
        State.win = true;
      default:
        State.hint = "";
        State.guess = GuessSafeEnum.NAN;
    }

    State.redirect(ctx);
  })
  .get("/reset", ctx => {
    if (State.win) {
      rand.reset();
      State.guess = GuessSafeEnum.RESET;
      State.win = false;
    }

    State.redirect(ctx);
  });

// Configuration middlewares
const app = new Application();
app
  .use(router.routes())
  .use(router.allowedMethods())
  .use(ctx => {
    ctx.response.status = 404;
    ctx.response.body = "Not found. ¯\\_(ツ)_/¯";
  });

// top-level await
await app.listen(`${App.HOST}:${App.PORT}`);
