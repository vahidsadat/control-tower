import { Router } from "express";
import { getAllPipelines, deletePipelineItem } from "../controllers/pipeline";

const router = Router();

router.get('/',getAllPipelines);
router.delete('/:id',deletePipelineItem);

export default router;