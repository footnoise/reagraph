import React, { FC, useMemo } from 'react';
import { useSpring, a } from '@react-spring/three';
import { animationConfig } from '../../utils/animation';
import { Color, DoubleSide } from 'three';
import { NodeRendererProps } from '../../types';

export interface TFSphereWithBorderProps extends NodeRendererProps {
  borderColor: string;
}

export const TFSphereWithBorder: FC<TFSphereWithBorderProps> = ({
  color,
  borderColor,
  id,
  size,
  opacity,
  animated
}) => {
  const { scale, nodeOpacity } = useSpring({
    from: {
      // Note: This prevents incorrect scaling w/ 0
      scale: [0.00001, 0.00001, 0.00001],
      nodeOpacity: 0
    },
    to: {
      scale: [size, size, size],
      nodeOpacity: opacity
    },
    config: {
      ...animationConfig,
      duration: animated ? 1 : 0
    }
  });
  const normalizedColor = useMemo(() => new Color(color), [color]);

  return (
    <a.mesh userData={{ id, type: 'node' }} scale={scale as any}>
      <a.mesh>
        <ringGeometry attach="geometry" args={[1, 1.1, 32]} />
        <a.meshPhongMaterial
          attach="material"
          opacity={1}
          color={borderColor}
        />
      </a.mesh>
      <a.mesh>
        <circleGeometry attach="geometry" args={[1, 25, 25]} />
        <a.meshPhongMaterial
          attach="material"
          side={DoubleSide}
          transparent={true}
          fog={true}
          opacity={opacity}
          color={color} // normalizedColor
        />
      </a.mesh>
    </a.mesh>
  );
};

TFSphereWithBorder.defaultProps = {
  opacity: 1,
  active: false
};
