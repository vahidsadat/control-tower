import { Router } from "express";
import { getAllPipelines, deletePipelineItem,resetPipelines } from "../controllers/pipeline";

const router = Router();

router.get('/',getAllPipelines);
router.delete('/:id',deletePipelineItem);
router.post('/reset',resetPipelines);

export default router;