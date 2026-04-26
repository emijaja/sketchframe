import type { NodeId, SceneNode, SceneDocument } from './types';

/** JSON-safe representation of SceneDocument (Map → array) */
export interface SerializedDocument {
  nodes: SceneNode[];
  rootOrder: NodeId[];
  gridRows: number;
  gridCols: number;
}

/** Convert SceneDocument to a JSON-serializable object */
export function serializeDocument(doc: SceneDocument): SerializedDocument {
  return {
    nodes: Array.from(doc.nodes.values()),
    rootOrder: doc.rootOrder,
    gridRows: doc.gridRows,
    gridCols: doc.gridCols,
  };
}

/** Reconstruct SceneDocument from serialized JSON */
export function deserializeDocument(data: SerializedDocument): SceneDocument {
  return {
    nodes: new Map(data.nodes.map((n) => [n.id, hydrateNode(n)])),
    rootOrder: data.rootOrder,
    gridRows: data.gridRows,
    gridCols: data.gridCols,
  };
}

/** Ensure BaseNode defaults are present after JSON round-trip */
function hydrateNode(n: SceneNode): SceneNode {
  return {
    ...n,
    visible: n.visible ?? true,
    locked: n.locked ?? false,
    parentId: n.parentId ?? null,
  };
}
