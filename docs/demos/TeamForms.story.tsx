import { range } from 'd3-array';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GraphCanvas, Svg, LayoutTypes, SphereWithIcon, SphereWithSvg, DefaultNode } from '../../src';
import {
  iconNodes,
  manyNodes,
  simpleEdges,
  simpleNodes,
  simpleNodesColors
} from '../assets/demo';

//import { faUser, faCoffee } from '@fortawesome/free-solid-svg-icons'
import faUser from '../assets/fa-icons/fa-user.svg';
import faUsers from '../assets/fa-icons/fa-users.svg';
import faChartPie from '../assets/fa-icons/fa-chart-pie.svg';
import faBuilding from '../assets/fa-icons/fa-building.svg';
import faAddressCard from '../assets/fa-icons/fa-address-card.svg';
import faMapMarkerAlt from '../assets/fa-icons/fa-map-marker-alt.svg';
import originalDataStructure from '../assets/original-data-structure.json';

export default {
  title: 'Demos/TeamForms',
  component: GraphCanvas
};

const random = (floor, ceil) => Math.floor(Math.random() * ceil) + floor;

export const NoEdges = () => <GraphCanvas nodes={manyNodes} edges={[]} />;

export const Icons = () => (
  <GraphCanvas
    nodes={iconNodes}
    edges={simpleEdges}
  />
);

export const Custom3DNode = () => (
  <GraphCanvas
    nodes={simpleNodes}
    edges={simpleEdges}
    cameraMode="rotate"
    renderNode={({ size, color, opacity }) => (
      <group>
        <mesh>
          <torusKnotGeometry attach="geometry" args={[size, 1.25, 50, 8]} />
          <meshBasicMaterial
            attach="material"
            color={color}
            opacity={opacity}
            transparent
          />
        </mesh>
      </group>
    )}
  />
);

export const SphereWithIconNode = () => (
  <GraphCanvas
    nodes={iconNodes}
    edges={simpleEdges}
    cameraMode="rotate"
    renderNode={({  node, ...rest }) => (
      <SphereWithIcon
        {...rest}
        node={node}
        image={(<FontAwesomeIcon icon="check-square" />)}
      />
    )}
  />
);

export const SvgIconNode = () => (
  <GraphCanvas
    nodes={iconNodes}
    edges={simpleEdges}
    cameraMode="rotate"
    renderNode={({  node, ...rest }) => (
      <Svg
        {...rest}
        node={node}
        image={node.icon || ''}
      />
    )}
  />
);

const convertToNodes = function(data) {
  var nodes = []
  const ICONS_MAPPING = {

  }
  Object.values(data).forEach(node => {
    if (node.type === 'node') {
      const newNode = {
        id: node.id,
        type: node.type,
        label: node.label.text,
        fill : node.color,
      }

      if (node.fontIcon.text === 'fa-user') {
        newNode.icon = faUser;
      }

      if (node.fontIcon.text === 'fa-users') {
        newNode.icon = faUsers;
      }

      if (node.fontIcon.text === 'fa-chart-pie') {
        newNode.icon = faChartPie;
      }
      
      if (node.fontIcon.text === 'fa-building') {
        newNode.icon = faBuilding;
      }

      if (node.fontIcon.text === 'fa-address-card') {
        newNode.icon = faAddressCard;
      }

      if (node.fontIcon.text === 'fa-map-marker-alt') {
        newNode.icon = faMapMarkerAlt;
      }
      
      nodes.push(newNode);
    }
  });

  return nodes
}

const convertToEdges = function(data) {
  var edges = []
  
  Object.values(data).forEach(edge => {
    if (edge.type === 'link') {
      const newEdge = {
        id: edge.id,
        type: edge.type,
        label: edge.relationshipType,
        source : edge.id1,
        target : edge.id2,
      }

      edges.push(newEdge);
    }
  });
  return edges;
}

export const CurrentDataSet = function() {
    const _nodes = convertToNodes(originalDataStructure);
    const _edges = convertToEdges(originalDataStructure);
    
    return (
      <GraphCanvas
        nodes={_nodes}
        edges={_edges}
        draggable
        renderNode={({  node, ...rest }) => (
          <DefaultNode
            {...rest}
            node={node}
            image={ node.icon || '' }
          />
        )}
      />
    )
  }
;

export const Draggable = () => {
  const [layout, setLayout] = useState<LayoutTypes>('forceDirected2d');
  const [nodes, setNodes] = useState(simpleNodes);

  return (
    <div>
      <button
        style={{
          position: 'absolute',
          top: 15,
          right: 15,
          zIndex: 999,
          width: 120
        }}
        onClick={() =>
          setNodes([
            ...nodes,
            { id: `n-${nodes.length}`, label: `Node ${nodes.length}` }
          ])
        }
      >
        Update Nodes
      </button>
      <button
        style={{
          position: 'absolute',
          top: 40,
          right: 15,
          zIndex: 999,
          width: 120
        }}
        onClick={() =>
          setLayout(
            layout === 'forceDirected2d' ? 'forceDirected3d' : 'forceDirected2d'
          )
        }
      >
        Reset Layout
      </button>
      <GraphCanvas
        nodes={nodes}
        edges={simpleEdges}
        draggable
        layoutType={layout}
      />
    </div>
  );
};
