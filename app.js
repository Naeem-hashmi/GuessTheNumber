const http = require("http");
const querystring = require("querystring");

let rendemNumber = ""; // Global variable

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(`
            <h1>Welcome to Guess the Number Game!</h1>
            <p>Are you ready to start the game?</p>
            <a href="/game">Start Game!</a>
        `);
  } else if (req.url === "/game" && req.method === "GET") {
    // Update global rendemNumber instead of redeclaring it locally
    rendemNumber = Math.floor(Math.random() * 100) + 1;
    console.log("Generated random number:", rendemNumber);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(`
            <h1>Guess the Number!</h1>
            <p>Choose a number between 1 and 100 below!</p>
            <form action="/result" method="POST">
            <input type="number" max="100" min="1" name="result" required></br>
            <button type="submit">Guess it!</button>
            </form>
        `);
  } else if (req.url === "/result" && req.method === "POST") {
    let result = "";

    req.on("data", (chunk) => {
      result += chunk.toString();
    });

    req.on("end", () => {
      const parsedResult = querystring.parse(result);
      const resultNumber = parseInt(parsedResult.result, 10);

      if (resultNumber === rendemNumber) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(`
                    <h1> Wow, you won the game! </h1>
                    <p>You guessed the correct number, which is ${rendemNumber}!</p>
                    <a href="/">Play again!</a>
                `);
      } else if (resultNumber < rendemNumber) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(`
                    <h1> Oops, it's incorrect! </h1>
                    <p>Your guess is lower than the number. Try again!</p>
                    <form action="/result" method="POST">
                    <input type="number" max="100" min="1" name="result" required></br>
                    <button type="submit">Guess it again!</button>
                    </form>
                `);
      } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(`
                    <h1> Oops, it's incorrect! </h1>
                    <p>Your guess is higher than the number. Try again!</p>
                    <form action="/result" method="POST">
                    <input type="number" max="100" min="1" name="result" required></br>
                    <button type="submit">Guess it again!</button>
                    </form>
                `);
      }
    });
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("404 page not found!");
  }
});

server.listen(3000, () => console.log("Server is running on port 3000"));
