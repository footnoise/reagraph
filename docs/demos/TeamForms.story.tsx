import React, { useState, useRef } from 'react';
import { GraphCanvas, GraphCanvasRef, Svg, LayoutTypes, TFCustomNode, useSelection, lightTheme } from '../../src';

//import { faUser, faCoffee } from '@fortawesome/free-solid-svg-icons'
import faUser from '../assets/fa-icons/fa-user.svg';
import faUsers from '../assets/fa-icons/fa-users.svg';
import faChartPie from '../assets/fa-icons/fa-chart-pie.svg';
import faBuilding from '../assets/fa-icons/fa-building.svg';
import faAddressCard from '../assets/fa-icons/fa-address-card.svg';
import faMapMarkerAlt from '../assets/fa-icons/fa-map-marker-alt.svg';
import originalDataStructure from '../assets/original-data-structure.json';
import originalDataStructureHuge from '../assets/original-data-structure-huge.json';
import _ from 'lodash';

export default {
  title: 'Demos/TeamForms',
  component: GraphCanvas
};

const ICONS_MAPPING = {
  'fa-user' : faUser,
  'fa-users' : faUsers,
  'fa-chart-pie' : faChartPie,
  'fa-building' : faBuilding,
  'fa-address-card' : faAddressCard,
  'fa-map-marker-alt' : faMapMarkerAlt
}

const convertData = (data : Object, typesToExclude : Array<String>) : any => {
  const rawNodes : Array<Object> = [];
  const rawEdges : Array<Object> = [];
  const nodes : Array<Object> = [];
  const edges : Array<Object> = [];
  const rejectedIds : Array<String> = []

  Object.values(data).forEach(node => {
    if (node.type === 'node') {
      const newNode = {
        id: node.id,
        type: node.data.type,
        label: node.label.text,
        fill : node.color,
        borderColor : node.border.color,
        icon : ICONS_MAPPING[node.fontIcon.text],
        url : node.url,
        counter : node.counter
      }
      
      rawNodes.push(newNode);
    }

    if (node.type === 'link') {
      const newEdge = {
        id: node.id,
        type: node.type,
        label: node.relationshipType,
        target : node.id2,
        source : node.id1,
      }

      rawEdges.push(newEdge);
    }
  });
  
  rawNodes.forEach((node) => {
    console.log(node);
    console.log(typesToExclude, "=", node.type);
    if (typesToExclude.includes(node.type)) {
      rejectedIds.push(node.id);
    } else {
      nodes.push(node);
    }
  });

  rawEdges.forEach((edge) => {
    if (!rejectedIds.includes(edge.target) && !rejectedIds.includes(edge.source)) {
      edges.push(edge);
    }
  })

  return { nodes, edges }
}

export const CurrentSimpleDataSet = function() {
    const graphRef = useRef<GraphCanvasRef | null>(null);
    const [types, setTypes] = useState<Array<String>>([]);
    const [layoutType, setLayoutType] = useState<LayoutTypes>('forceDirected2d');
    
    const handleAddType = (typeName : String) => {
      setTypes([...types, typeName]);
    };
  
    const handleRemoveType = (typeName : String) => {
      setTypes(types.filter((type) => type !== typeName));
    };

    let { nodes, edges } = convertData(originalDataStructure, types);
    

    const theme = lightTheme
    theme.node.activeFill = '#ffbc00';
    theme.node.label.activeColor = '#ffbc00';
    theme.ring.activeFill = '#ffbc00';
    theme.edge.activeFill = '#ffbc00';
    theme.arrow.activeFill = '#ffbc00';
    
    const {
      selections,
      actives,
      onNodeClick,
      onCanvasClick,
    } = useSelection({
      ref: graphRef,
      nodes,
      edges,
      pathSelectionType: 'all'
    });

    const downloadImage = () => {
      const url = graphRef.current?.getControls()._domElement?.toDataURL();
      const fakeDownloader = document.createElement('a');
      fakeDownloader.href = url;
      fakeDownloader.download = 'canvas';
      fakeDownloader.click();
      fakeDownloader.remove();
    }

    return (
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
        <div style={{ zIndex: 9, position: 'absolute', top: 15, right: 15, background: 'rgba(0, 0, 0, .5)', padding: 1, color: 'white' }}>
          <button style={{ display: 'block', width: '100%' }} onClick={() => graphRef.current?.centerGraph([nodes[0].id])}>Center</button>
          <br />
          <button style={{ display: 'block', width: '100%' }} onClick={() => graphRef.current?.zoomIn()}>Zoom In</button>
          <button style={{ display: 'block', width: '100%' }} onClick={() => graphRef.current?.zoomOut()}>Zoom Out</button>
          <br />
          <button style={{ display: 'block', width: '100%' }} onClick={() => graphRef.current?.panDown()}>Move Down</button>
          <button style={{ display: 'block', width: '100%' }} onClick={() => graphRef.current?.panUp()}>Move Up</button>
          <button style={{ display: 'block', width: '100%' }} onClick={() => graphRef.current?.panLeft()}>Move Left</button>
          <button style={{ display: 'block', width: '100%' }} onClick={() => graphRef.current?.panRight()}>Move Right</button>
          <br/>
          <button style={{ display: 'block', width: '100%' }} onClick={() => downloadImage()}>Download Image</button>
          <br/>
          <label>
            <input type="checkbox" onClick={() => setLayoutType( layoutType === 'hierarchicalTd' ? 'forceDirected2d' : 'hierarchicalTd')}/>
            Hierarchical view
          </label>
          <br/>
          <label>
            <input type="checkbox" onClick={(e) => { e.target.checked ? handleAddType('Person') : handleRemoveType('Person') }}/>
            Hide people nodes
          </label>
          <br/>
          <label>
            <input type="checkbox" onClick={(e) => { e.target.checked ? handleAddType('Company') : handleRemoveType('Company') }}/>
            Hide company nodes
          </label>
          <br/>
          <label>
            <input type="checkbox" onClick={(e) => { e.target.checked ? handleAddType('Division') : handleRemoveType('Division') }}/>
            Hide division nodes
          </label>
          <br/>
          <label>
            <input type="checkbox" onClick={(e) => { e.target.checked ? handleAddType('Job') : handleRemoveType('Job') }}/>
            Hide job notes
          </label>
          <br/>
          <label>
            <input type="checkbox" onClick={(e) => { e.target.checked ? handleAddType('Location') : handleRemoveType('Location') }}/>
            Hide location nodes
          </label>
          <br/>
          <label>
            <input type="checkbox" onClick={(e) => { e.target.checked ? handleAddType('Team') : handleRemoveType('Team') }}/>
            Hide group associations       
          </label>
        </div>
        <GraphCanvas
          ref={graphRef}
          theme={ theme }
          selections={selections}
          actives={actives}
          layoutType={layoutType}
          onCanvasClick={onCanvasClick}
          onNodeClick={onNodeClick}
          nodes={nodes}
          edges={edges}
          animated={ true }
          draggable
          renderNode={({  node, ...rest }) => (
            <TFCustomNode
              {...rest}
              node={node}
              image={ node.icon || '' }
              borderColor={ node.borderColor }
              counter= { node.counter }
            />
          )}
        >
        </GraphCanvas>
      </div>
    )
  };

  export const CurrentHugeDataSet = function() {
    const graphRef = useRef<GraphCanvasRef | null>(null);
    const [types, setTypes] = useState<Array<String>>([]);
    const [layoutType, setLayoutType] = useState<LayoutTypes>('forceDirected2d');
    
    const handleAddType = (typeName : String) => {
      setTypes([...types, typeName]);
    };
  
    const handleRemoveType = (typeName : String) => {
      setTypes(types.filter((type) => type !== typeName));
    };

    let { nodes, edges } = convertData(originalDataStructureHuge, types);

    const theme = lightTheme
    theme.node.activeFill = '#ffbc00';
    theme.node.label.activeColor = '#ffbc00';
    theme.ring.activeFill = '#ffbc00';
    theme.ring.defaultGeometry = [4, 7, 25];
    theme.edge.activeFill = '#ffbc00';
    theme.arrow.activeFill = '#ffbc00';
    
    const {
      selections,
      actives,
      onNodeClick,
      onCanvasClick,
    } = useSelection({
      ref: graphRef,
      nodes,
      edges,
      pathSelectionType: 'all'
    });
    
    const downloadImage = () => {
      const url = graphRef.getControls()._domElement?.toDataURL();
      const fakeDownloader = document.createElement('a');
      fakeDownloader.href = url;
      fakeDownloader.download = 'canvas';
      fakeDownloader.click();
      fakeDownloader.remove();
    }
    
    return (
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
        <div style={{ zIndex: 9, position: 'absolute', top: 15, right: 15, background: 'rgba(0, 0, 0, .5)', padding: 1, color: 'white' }}>
          <button style={{ display: 'block', width: '100%' }} onClick={() => graphRef.current?.centerGraph([_nodes[0].id])}>Center</button>
          <br />
          <button style={{ display: 'block', width: '100%' }} onClick={() => graphRef.current?.zoomIn()}>Zoom In</button>
          <button style={{ display: 'block', width: '100%' }} onClick={() => graphRef.current?.zoomOut()}>Zoom Out</button>
          <br />
          <button style={{ display: 'block', width: '100%' }} onClick={() => graphRef.current?.panDown(100)}>Move Down</button>
          <button style={{ display: 'block', width: '100%' }} onClick={() => graphRef.current?.panUp(100)}>Move Up</button>
          <button style={{ display: 'block', width: '100%' }} onClick={() => graphRef.current?.panLeft(100)}>Move Left</button>
          <button style={{ display: 'block', width: '100%' }} onClick={() => graphRef.current?.panRight(100)}>Move Right</button>
          <br/>
          <button style={{ display: 'block', width: '100%' }} onClick={() => downloadImage()}>Download Image</button>
          <br/>
          <label>
            <input type="checkbox" onClick={() => setLayoutType( layoutType === 'hierarchicalTd' ? 'forceDirected2d' : 'hierarchicalTd')}/>
            Hierarchical view
          </label>
          <br/>
          <label>
            <input type="checkbox" onClick={(e) => { e.target.checked ? handleAddType('Person') : handleRemoveType('Person') }}/>
            Hide people nodes
          </label>
          <br/>
          <label>
            <input type="checkbox" onClick={(e) => { e.target.checked ? handleAddType('Company') : handleRemoveType('Company') }}/>
            Hide company nodes
          </label>
          <br/>
          <label>
            <input type="checkbox" onClick={(e) => { e.target.checked ? handleAddType('Division') : handleRemoveType('Division') }}/>
            Hide division nodes
          </label>
          <br/>
          <label>
            <input type="checkbox" onClick={(e) => { e.target.checked ? handleAddType('Job') : handleRemoveType('Job') }}/>
            Hide job notes
          </label>
          <br/>
          <label>
            <input type="checkbox" onClick={(e) => { e.target.checked ? handleAddType('Location') : handleRemoveType('Location') }}/>
            Hide location nodes
          </label>
          <br/>
          <label>
            <input type="checkbox" onClick={(e) => { e.target.checked ? handleAddType('Team') : handleRemoveType('Team') }}/>
            Hide group associations       
          </label>       
        </div>
        <GraphCanvas
          ref={graphRef}
          theme={ theme }
          glOptions={{preserveDrawingBuffer: true}}
          selections={selections}
          actives={actives}
          layoutType={layoutType}
          onCanvasClick={onCanvasClick}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={(node) => alert(node.label)}
          nodes={nodes}
          edges={edges}
          animated={ true }
          draggable
          renderNode={({  node, ...rest }) => (
            <TFCustomNode
              {...rest}
              node={node}
              image={ node.icon || '' }
              borderColor={ node.borderColor }
              counter= { node.counter }
            />
          )}
        >
        </GraphCanvas>
      </div>
    )
  };