import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("/our-pets","routes/OurPets.tsx"),
    route("/contact","routes/Contact.tsx"),
    route("/pets-list","routes/ListePets.tsx"),
    route("/pet/:id", "routes/PetProfile.tsx"),
    route("/pet/:id/adopt", "routes/pets.$petID.adopt.tsx"),
    route("/mes-demandes", "routes/MesDemandes.tsx"),

    route("/profile","routes/Profile.tsx"),
    route("/favorites", "routes/Favorites.tsx"),
    route("/welcome-user", "routes/WelcomeUser.tsx"),
    route("/login","routes/Login.tsx"),      // lowercase
    route("/register","routes/Register.tsx"),  // lowercase
    route("/error","routes/Error.tsx"),
    route("/forgot-password","routes/forgot-password.tsx"),
    route("/reset-password","routes/Reset-password.tsx"),
  ] satisfies RouteConfig;

