export const figmaAssets = [
  {
    node: "373-125",
    nodeId: "373:125",
    name: "chair",
    src: "https://www.figma.com/api/mcp/asset/da722c1d-5176-4c3e-83aa-78c00a680cb6"
  },
  {
    node: "371-108",
    nodeId: "371:108",
    name: "cactus-balloon",
    src: "https://www.figma.com/api/mcp/asset/19b24cfa-c81e-40e2-8e3d-cebe0be06e11"
  },
  {
    node: "373-112",
    nodeId: "373:112",
    name: "hamster-reading",
    src: "https://www.figma.com/api/mcp/asset/35ee7a31-79d7-43df-9785-171ca9599cfd"
  },
  {
    node: "373-128",
    nodeId: "373:128",
    name: "love",
    src: "https://www.figma.com/api/mcp/asset/4a3f972a-2e00-448f-bb67-e78ffd781780"
  },
  {
    node: "375-132",
    nodeId: "375:132",
    name: "bird-pizza",
    src: "https://www.figma.com/api/mcp/asset/a0c58e11-4af3-47c8-8ecc-1aeb61eaefe9"
  },
  {
    node: "375-136",
    nodeId: "375:136",
    name: "donkey",
    src: "https://www.figma.com/api/mcp/asset/bad10533-c9b8-4cff-9cac-1d80cc69e9cf"
  },
  {
    node: "375-140",
    nodeId: "375:140",
    name: "squid",
    src: "https://www.figma.com/api/mcp/asset/6da650ff-6e20-47c2-9103-5e6c4fadb607"
  },
  {
    node: "376-144",
    nodeId: "376:144",
    name: "baby",
    src: "https://www.figma.com/api/mcp/asset/6fbad5c2-9d49-4ea9-a5af-f0c90f04413e"
  }
];

export function getFigmaAsset(node) {
  return figmaAssets.find((a) => a.node === node) || null;
}

