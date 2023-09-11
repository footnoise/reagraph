import React, {
  FC,
  forwardRef,
  ReactNode,
  Ref,
  Suspense,
  useImperativeHandle,
  useRef
} from 'react';
import { Canvas } from '@react-three/fiber';
import { GraphScene, GraphSceneProps, GraphSceneRef } from './GraphScene';
import { TFGraphScene } from './TFGraphScene';
import {
  CameraMode,
  TFCameraControls,
  CameraControlsRef
} from './CameraControls';
import { Theme, lightTheme } from './themes';
import { createStore, Provider } from './store';
import Graph from 'graphology';
import { Lasso, LassoType } from './selection';
import ThreeCameraControls from 'camera-controls';
import css from './GraphCanvas.module.css';
import { GraphCanvasProps, GraphCanvasRef } from 'GraphCanvas';

const GL_DEFAULTS = {
  alpha: true,
  antialias: true
};

// TODO: Fix type
const CAMERA_DEFAULTS: any = {
  position: [0, 0, 1000],
  near: 5,
  far: 50000,
  fov: 10
};

export const TFGraphCanvas: FC<
  GraphCanvasProps & { ref?: Ref<GraphCanvasRef> }
> = forwardRef(
  (
    {
      cameraMode,
      edges,
      children,
      nodes,
      theme,
      onCanvasClick,
      animated,
      disabled,
      lassoType,
      onLasso,
      onLassoEnd,
      ...rest
    },
    ref: Ref<GraphCanvasRef>
  ) => {
    const rendererRef = useRef<GraphSceneRef | null>(null);
    const controlsRef = useRef<CameraControlsRef | null>(null);

    useImperativeHandle(ref, () => ({
      centerGraph: (n?: string[]) => rendererRef.current?.centerGraph(n),
      zoomIn: () => controlsRef.current?.zoomIn(),
      zoomOut: () => controlsRef.current?.zoomOut(),
      panLeft: () => controlsRef.current?.panLeft(),
      panRight: () => controlsRef.current?.panRight(),
      panDown: () => controlsRef.current?.panDown(),
      panUp: () => controlsRef.current?.panUp(),
      resetControls: (animated?: boolean) =>
        controlsRef.current?.resetControls(animated),
      getControls: () => controlsRef.current?.controls,
      getGraph: () => rendererRef.current?.graph,
      downloadImage: () => {
        const url = controlsRef.current?.controls?._domElement?.toDataURL();
        const fakeDownloader = document.createElement('a');
        fakeDownloader.href = url;
        fakeDownloader.download = 'canvas';
        fakeDownloader.click();
        fakeDownloader.remove();
      }
    }));

    // Defaults to pass to the store
    const { selections, actives, collapsedNodeIds } = rest;

    // It's pretty hard to get good animation performance with large n of edges/nodes
    const finalAnimated = edges.length + nodes.length > 400 ? false : animated;

    // NOTE: The legacy/linear/flat flags are for color issues
    // Reference: https://github.com/protectwise/troika/discussions/213#discussioncomment-3086666
    return (
      <div className={css.canvas}>
        <Canvas
          legacy
          linear
          flat
          gl={{ preserveDrawingBuffer: true, ...GL_DEFAULTS }}
          camera={CAMERA_DEFAULTS}
          onPointerMissed={onCanvasClick}
        >
          <Provider
            createStore={() =>
              createStore({
                selections,
                actives,
                theme,
                collapsedNodeIds
              })
            }
          >
            <color attach="background" args={[theme.canvas.background]} />
            <ambientLight intensity={1} />
            {children}
            {theme.canvas.fog && (
              <fog attach="fog" args={[theme.canvas.fog, 4000, 9000]} />
            )}
            <TFCameraControls
              mode={cameraMode}
              ref={controlsRef}
              animated={animated}
              disabled={disabled}
            >
              <Lasso
                theme={theme}
                disabled={disabled}
                type={lassoType}
                onLasso={onLasso}
                onLassoEnd={onLassoEnd}
              >
                <Suspense>
                  <TFGraphScene
                    ref={rendererRef as any}
                    theme={theme}
                    disabled={disabled}
                    animated={finalAnimated}
                    edges={edges}
                    nodes={nodes}
                    {...rest}
                  />
                </Suspense>
              </Lasso>
            </TFCameraControls>
          </Provider>
        </Canvas>
      </div>
    );
  }
);

TFGraphCanvas.defaultProps = {
  cameraMode: 'pan',
  layoutType: 'forceDirected2d',
  sizingType: 'default',
  labelType: 'auto',
  theme: lightTheme,
  animated: true,
  defaultNodeSize: 7,
  minNodeSize: 5,
  maxNodeSize: 15,
  lassoType: 'none'
};
