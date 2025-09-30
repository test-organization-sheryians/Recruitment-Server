import config from "./environment.js";

const AllowedOrigins = config.ALLOWED_ORIGINS?.split(",") || [];

export const corsOptions = {
  origin: function (origin, callback) {
    if (
      AllowedOrigins.indexOf(origin) !== -1 ||
      (config.NODE_ENV === "development" && !origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
