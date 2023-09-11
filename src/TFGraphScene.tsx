import React, {
  FC,
  forwardRef,
  Fragment,
  ReactNode,
  Ref,
  useImperativeHandle,
  useMemo
} from 'react';
import { useGraph } from './useGraph';
import { LayoutOverrides, LayoutTypes } from './layout';
import {
  NodeContextMenuProps,
  ContextMenuEvent,
  GraphEdge,
  GraphNode,
  InternalGraphEdge,
  InternalGraphNode,
  NodeRenderer,
  CollapseProps
} from './types';
import { SizingType } from './sizing';
import {
  Cluster,
  ClusterEventArgs,
  Edge,
  EdgeArrowPosition,
  EdgeInterpolation,
  EdgeLabelPosition,
  Edges,
  TFNode
} from './symbols';
import { useCenterGraph } from './CameraControls';
import { LabelVisibilityType } from './utils';
import { Theme } from './themes';
import { useStore } from './store';
import { GraphSceneProps, GraphSceneRef } from './GraphScene';

export const TFGraphScene: FC<GraphSceneProps & { ref?: Ref<GraphSceneRef> }> =
  forwardRef(
    (
      {
        onNodeClick,
        onNodeContextMenu,
        onEdgeContextMenu,
        onEdgeClick,
        onEdgePointerOver,
        onEdgePointerOut,
        onNodePointerOver,
        onNodePointerOut,
        onClusterClick,
        onNodeDragged,
        onClusterPointerOver,
        onClusterPointerOut,
        contextMenu,
        theme,
        animated,
        disabled,
        draggable,
        edgeLabelPosition,
        edgeArrowPosition,
        edgeInterpolation,
        labelFontUrl,
        renderNode,
        ...rest
      },
      ref
    ) => {
      const { mounted } = useGraph(rest);

      const graph = useStore(state => state.graph);
      const nodes = useStore(state => state.nodes);
      const edges = useStore(state => state.edges);
      const clusters = useStore(state => [...state.clusters.values()]);

      const nodeIds = useMemo(() => nodes.map(n => n.id), [nodes]);
      const edgeIds = useMemo(() => edges.map(e => e.id), [edges]);

      const { centerNodesById } = useCenterGraph({
        animated
      });

      useImperativeHandle(
        ref,
        () => ({
          centerGraph: centerNodesById,
          graph
        }),
        [centerNodesById, graph]
      );

      return (
        <Fragment>
          {mounted && (
            <Fragment>
              {nodeIds.map(n => (
                <TFNode
                  key={n}
                  id={n}
                  labelFontUrl={labelFontUrl}
                  draggable={draggable}
                  disabled={disabled}
                  animated={animated}
                  contextMenu={contextMenu}
                  renderNode={renderNode}
                  onClick={onNodeClick}
                  onContextMenu={onNodeContextMenu}
                  onPointerOver={onNodePointerOver}
                  onPointerOut={onNodePointerOut}
                  onDragged={onNodeDragged}
                />
              ))}
              {animated ? (
                edgeIds.map(e => (
                  <Edge
                    key={e}
                    id={e}
                    disabled={disabled}
                    animated={animated}
                    labelFontUrl={labelFontUrl}
                    labelPlacement={edgeLabelPosition}
                    arrowPlacement={edgeArrowPosition}
                    interpolation={edgeInterpolation}
                    contextMenu={contextMenu}
                    onClick={onEdgeClick}
                    onContextMenu={onEdgeContextMenu}
                    onPointerOver={onEdgePointerOver}
                    onPointerOut={onEdgePointerOut}
                  />
                ))
              ) : (
                <Edges
                  theme={theme}
                  edges={edges}
                  disabled={disabled}
                  animated={animated}
                  labelFontUrl={labelFontUrl}
                  labelPlacement={edgeLabelPosition}
                  arrowPlacement={edgeArrowPosition}
                  interpolation={edgeInterpolation}
                  contextMenu={contextMenu}
                  onClick={onEdgeClick}
                  onContextMenu={onEdgeContextMenu}
                  onPointerOver={onEdgePointerOver}
                  onPointerOut={onEdgePointerOut}
                />
              )}
              {clusters.map(c => (
                <Cluster
                  key={c.label}
                  animated={animated}
                  disabled={disabled}
                  labelFontUrl={labelFontUrl}
                  onClick={onClusterClick}
                  onPointerOver={onClusterPointerOver}
                  onPointerOut={onClusterPointerOut}
                  {...c}
                />
              ))}
            </Fragment>
          )}
        </Fragment>
      );
    }
  );

TFGraphScene.defaultProps = {
  edgeInterpolation: 'linear'
};
