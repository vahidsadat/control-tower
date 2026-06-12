import { Router } from "express";
import { getAllPipelines, deletePipelineItem,resetPipelines,updatePipelineItem } from "../controllers/pipeline";

const router = Router();

router.get('/',getAllPipelines);
router.delete('/:id',deletePipelineItem);
router.patch('/:id',updatePipelineItem);
router.post('/reset',resetPipelines);

export default router;