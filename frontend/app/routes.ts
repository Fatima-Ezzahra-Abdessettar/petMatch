import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/our-pets", "routes/OurPets.tsx"),
  route("/contact", "routes/Contact.tsx"),
  route("/pets/:petId/adopt", "routes/pets.$petId.adopt.tsx"),
  route("/login","routes/Login.tsx"),      // lowercase
  route("/register","routes/Register.tsx"),  // lowercase
  route("/error","routes/Error.tsx")
] satisfies RouteConfig;