import fs from "fs/promises";
import path from "path";

const TEMPLATE_PATH = path.join(process.cwd(), "lib", "comfy", "workflows", "ccdD_gen_moji-z_image_v7.template.json");

export async function loadWorkflowTemplate() {
  const raw = await fs.readFile(TEMPLATE_PATH, "utf8");
  return JSON.parse(raw);
}

function setNodeInput(workflow, nodeId, key, value) {
  const node = workflow?.[String(nodeId)];
  if (!node || !node.inputs) throw new Error(`Missing node ${nodeId} in workflow template`);
  node.inputs[key] = value;
}

export function buildWorkflowFromTemplate(template, { prompt, seed, width, height }) {
  const workflow = JSON.parse(JSON.stringify(template || {}));

  // Prompt text (Text Multiline)
  setNodeInput(workflow, 172, "text", String(prompt || "").trim());

  // Seed (KSampler)
  if (Number.isFinite(seed)) setNodeInput(workflow, 77, "seed", Number(seed));

  // Size (EmptySD3LatentImage)
  if (Number.isFinite(width)) setNodeInput(workflow, 71, "width", Number(width));
  if (Number.isFinite(height)) setNodeInput(workflow, 71, "height", Number(height));

  return workflow;
}

