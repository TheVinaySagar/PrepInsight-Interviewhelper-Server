import { Router } from "express";
import InterviewsController from "../controllers/InterviewsController.js";

const InterviewsRoutes = Router();

InterviewsRoutes.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});
InterviewsRoutes.get('/', InterviewsController.getInterviews);
InterviewsRoutes.get('/search', InterviewsController.searchInterviews);
InterviewsRoutes.get('/user-interviews', InterviewsController.userInterviews);
InterviewsRoutes.get('/trending', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=600');
  next();
}, InterviewsController.getTrendingInterviews);
InterviewsRoutes.get('/:id', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=300');
  next();
}, InterviewsController.interviewById);

InterviewsRoutes.post('/', InterviewsController.createInterview);
InterviewsRoutes.post('/:id/like', InterviewsController.likeInterview);
InterviewsRoutes.put('/:id', InterviewsController.updateInterview);
InterviewsRoutes.delete('/:id', InterviewsController.deleteInterview);

export default InterviewsRoutes;
