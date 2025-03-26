import { startServer } from "@index";

let server: any;

before(async function launch() {
  this.timeout(10000);
  server = await startServer();
  return server;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((err: any) => {
        if (err) {
          return reject(err);
        }
        return resolve(null);
      });
    });
  }
});
