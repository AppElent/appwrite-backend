import AppExpress from "@itznotabug/appexpress";
import cors from "@itznotabug/appexpress-cors";
import userRoutes from "./routes/user.js";
import issueRoutes from "./routes/issues.js";
import authMiddleware from "./middleware/auth.js";
import recipeRoutes from "./routes/recipes.js";

//URL: https://github.com/ItzNotABug/appexpress/wiki/Request-&-Response

const app = new AppExpress();

app.middleware(
  cors({
    origin: "*", // specify an origin or * for all,
    excludes: ["/styles.css"], // exclude cors on some urls, accepts String & Regex,
    preFlightContinue: false, // if false, empty response is sent on `OPTIONS` method,
    optionsSuccessStatus: 204, // status code to be sent on `OPTIONS`,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"], // allowed methods for cors,
  })
);

// Middleware
app.middleware(authMiddleware);

app.use("/users", userRoutes);
app.use("/issues", issueRoutes);
app.use("/recipes", recipeRoutes);

const getHome = (req, res) => {
  res.json({ test: true });
};

const getKlantverzoeken = (req, res) => {
  return res.json([{
    id: 1,
    ac: 4,
    klant: 'klant1'
  },{
    id: 2,
    ac: 1,
    klant: 'klant2'
  }])
}

const postNetcheckverzoek = (req, res) => {
  return res.json({
    status: 'ok',
    ac: req.query.ac
  })
}

app.get('/alliander/klantverzoeken', getKlantverzoeken); 
app.get('/alliander/netcheckverzoek', postNetcheckverzoek)
  
app.get("/", getHome);

// export default async ({ req, res, log }) => {
//     log(req.bodyText);                    // Raw request body, contains request data
//     //log(JSON.stringify(req.bodyJson));    // Object from parsed JSON request body, otherwise string
//     log(JSON.stringify(req.headers));     // String key-value pairs of all request headers, keys are lowercase
//     log(req.scheme);                      // Value of the x-forwarded-proto header, usually http or https
//     log(req.method);                      // Request method, such as GET, POST, PUT, DELETE, PATCH, etc.
//     log(req.url);                         // Full URL, for example: http://awesome.appwrite.io:8000/v1/hooks?limit=12&offset=50
//     log(req.host);                        // Hostname from the host header, such as awesome.appwrite.io
//     log(req.port);                        // Port from the host header, for example 8000
//     log(req.path);                        // Path part of URL, for example /v1/hooks
//     log(req.queryString);                 // Raw query params string. For example "limit=12&offset=50"
//     log(JSON.stringify(req.query));       // Parsed query params. For example, req.query.limit

//     return res.text("All the request parameters are logged to the Appwrite Console.");
// };

export default async (context) => await app.attach(context);
