import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/our-pets","routes/OurPets.tsx"),
    route("/contact","routes/Contact.tsx"),
    route("/pets-list","routes/ListePets.tsx"),
    route("/pet/:id", "routes/PetProfile.tsx")
  
] satisfies RouteConfig;

