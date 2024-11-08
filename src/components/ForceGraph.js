import { useEffect } from 'react';
import * as d3 from 'd3';

const ForceGraph = ({ data }) => {
    useEffect(() => {
        // Return if data is not an array or if empty
        if (!Array.isArray(data) || data.length === 0) return;
        // SVG element set width and height
        const svg = d3.select('#forceGraph')
            .attr('width', 800)
            .attr('height', 600);
        // Clear previous SVG content
        svg.selectAll('*').remove();
        // Create nodes and links 
        const nodes = [];
        const links = [];

        data.forEach(d => {
            if (!nodes.find(node => node.name === d.source)) {
                nodes.push({ name: d.source }); // Add the source node
            }
            if (!nodes.find(node => node.name === d.target)) {
                nodes.push({ name: d.target }); // Add the target node
            }
            // Add a link between the source and target nodes
            links.push({ source: d.source, target: d.target });
        });
        // Initialize the force simulation for the nodes
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink().id(d => d.name).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(400, 300));
        // Create tooltip for node information
        const nodeTooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background', 'lightsteelblue')
            .style('padding', '5px')
            .style('border-radius', '5px');
        // Create tooltip for link information
        const linkTooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background', 'lightsteelblue')
            .style('padding', '5px')
            .style('border-radius', '5px');

        // Create links (edges) in the graph
        const link = svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke', '#999')
            .attr('stroke-width', 2)
            .on('mouseover', (event, d) => {
              // Show tooltip on mouseover
                linkTooltip.transition().duration(200).style('opacity', 0.9);
                linkTooltip.html(`Relación: FRIENDS_WITH`)
                    .style('left', (event.pageX + 5) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', () => {
                linkTooltip.transition().duration(500).style('opacity', 0);
            });
        // Create nodes (vertices) in the graph
        const node = svg.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('r', 5) // Set radius of the node
            .attr('fill', 'steelblue')
            .call(d3.drag() // Enable dragging of nodes
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended))
            .on('mouseover', (event, d) => {
                nodeTooltip.transition().duration(200).style('opacity', 0.9);
                nodeTooltip.html(`Nombre: ${d.name}`)
                    .style('left', (event.pageX + 5) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', () => {
                nodeTooltip.transition().duration(500).style('opacity', 0);
            });
        // Update the simulation with the nodes and links
        simulation
            .nodes(nodes)
            .on('tick', () => {
                link
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);

                node
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y);
            });
        // Link the simulation to the links
        simulation.force('link').links(links);
        // Dragging functions
        function dragstarted(event, d) { // Restart simulation on drag start
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) { // Stop the simulation if no longer active
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

    }, [data]);

    return (
        <svg id="forceGraph"></svg> // SVG element to render the graph
    );
};

export default ForceGraph;
