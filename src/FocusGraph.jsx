import React, { useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { useGraphData } from './HomePage/components/GraphDataContext';

const FocusGraph = forwardRef((props, ref) => {
    const { resetCamera } = props;
    const { nodeClick } = props
    const fgRef = useRef();
    const { graphData, setGraphData } = useGraphData();

    const handleClick = useCallback(
        (node) => {
            const distance = 40;
            const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

            fgRef.current.cameraPosition(
                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
                node, // lookAt
                3000 // ms transition duration
            );
            nodeClick(node);
        },
        [fgRef]
    );

    const handleRightClick = useCallback((node) => {
        if (node.profile_url) {
            window.open(node.profile_url, '_blank');
        }
    }, []);

    useImperativeHandle(ref, () => ({
        resetCamera,
    }));

    useEffect(() => {
        if (resetCamera && fgRef.current) {
            fgRef.current.cameraPosition({ x: 0, y: 0, z: 1000 }, { x: 0, y: 0, z: 0 }, 3000);
        }
    }, [resetCamera]);

    useEffect(() => {
        if (!graphData) {
            fetch('./miserables.json')
                .then((res) => res.json())
                .then((data) => {
                    setGraphData(data);
                });
        }
    }, [graphData, setGraphData]);

    if (!graphData || !graphData.nodes || !graphData.links) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ width: '100vw', height: '100vh', margin: 0 }}>
            <ForceGraph3D
                ref={fgRef}
                graphData={graphData}
                nodeId="id"
                nodeAutoColorBy="position"
                nodeLabel="name"
                showNavInfo={false}
                nodeOpacity={0.8}
                enableNodeDrag={false}
                nodeVal={node => Math.sqrt(node.size) / 2}
                onNodeClick={handleClick}
                onNodeRightClick={handleRightClick}
                linkWidth={link => link.thickness}
                linkDirectionalParticles={10}
                linkDirectionalParticleWidth={1}
                linkDirectionalParticleSpeed={0.01}
                linkOpacity={0.1}
                backgroundColor="black"
            />
        </div>
    );
});

export default FocusGraph;