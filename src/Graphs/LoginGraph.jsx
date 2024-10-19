import React, { useEffect, useRef } from "react";
import ForceGraph3D from "react-force-graph-3d";
import {Button} from "@nextui-org/react"; 
import{BsArrowRepeat} from "react-icons/bs";
import './LoginGraph'

const generateFakeData = (nodeCount = 10, linkCount = 15) => {
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
        id: `user_${i}`,
        name: `User ${i}`,
    }));

    const links = Array.from({ length: linkCount }, () => {
        const source = Math.floor(Math.random() * nodeCount);
        let target = Math.floor(Math.random() * nodeCount);

        while (target === source) {
            target = Math.floor(Math.random() * nodeCount);
        }

        return {
            source: `user_${source}`,
            target: `user_${target}`,
        };
    });
    return { nodes, links };
};

const LoginGraph = () => {
    const fakeData = generateFakeData(250, 500);
    const graphRef = useRef();
    let angle = 0;

    const rotateGraph = () => {
        if (graphRef.current) {
            // Rotate the whole scene except for the central node
            const rotationSpeed = 0.01;
            graphRef.current.scene().rotation.y = angle;
            angle += rotationSpeed;
        }
    };

    const resetCameraPosition = () => {
        if (graphRef.current) {
            graphRef.current.cameraPosition(
                { x: 0, y: 0, z: 1000 },  
                { x: 0, y: 0, z: 0 },     
                3000                       
            );
        }
    };

    useEffect(() => {
        // Set the camera distance to 300
        if (graphRef.current) {
            graphRef.current.cameraPosition(
                { x: 0, y: 0, z: 1000 },
                { x: 0, y: 0, z: 0 },
                3000
            );
        }

        const interval = setInterval(rotateGraph, 25); // Rotate every 50ms
        return () => clearInterval(interval); // Clean up the interval on component unmount
    }, []);

    return (
        <div style={{position: 'relative'}}>
            <ForceGraph3D
                ref={graphRef}
                graphData={fakeData}
                nodeAutoColorBy={"id"}
                enableNodeDrag={false}
            />
              <Button className="reset-button" onClick={resetCameraPosition}>
                <BsArrowRepeat className="icon" />
            </Button>
        </div>  
    );
};

export default LoginGraph;
