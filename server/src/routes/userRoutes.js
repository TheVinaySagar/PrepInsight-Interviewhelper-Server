import { Router } from "express";
import auth from "../middleware/firebase.js";
import UserController from "../controllers/userController.js";
const userRoutes = Router();

userRoutes.use((req, res, next) => {
  // Apply no-cache headers to sensitive data routes
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

userRoutes.get('/profile', auth, UserController.profile)
userRoutes.get('/interviews', auth, UserController.interviews)
userRoutes.put('/profile', auth, UserController.profile_update)
userRoutes.get('/profile-data', auth, UserController.profile_data)
userRoutes.get('/stats', auth, UserController.stats)
userRoutes.get("/photos", UserController.latestUserPhotos);


userRoutes.get("/photos", (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=86400');
  next();
}, UserController.latestUserPhotos);

export default userRoutes;
