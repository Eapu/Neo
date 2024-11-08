import { useEffect } from 'react';
import * as d3 from 'd3';

const SchemaGraph = ({ data }) => {
    useEffect(() => {
        // Return if no data or empty data array
        if (!data || !data.length) return;

        const svgWidth = 800;
        const svgHeight = 600;

        const svg = d3.select('#schemaGraph')
            .attr('width', svgWidth)
            .attr('height', svgHeight);

        svg.selectAll('*').remove(); // Clear the SVG before drawing

        const nodes = [];
        const links = [];

        // Create nodes and links
        data.forEach(d => {
            if (d.source && d.target) {
                // Create nodes with the correct names
                if (!nodes.find(n => n.id === d.source)) {
                    nodes.push({ id: d.source, name: d.source }); // Use the actual name
                }
                if (!nodes.find(n => n.id === d.target)) {
                    nodes.push({ id: d.target, name: d.target }); // Use the actual name
                }
                links.push({ source: d.source, target: d.target });
            }
        });

        console.log('Nodes:', nodes);
        console.log('Links:', links);

        // Initialize the tooltip
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        // Initialize the simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink().id(d => d.id).distance(50))
            .force('charge', d3.forceManyBody().strength(-50))
            .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2))
            .on('tick', ticked);

        // Create links
        const link = svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('stroke', '#999')
            .attr('stroke-width', 1)
            .on('mouseover', function(event) {
                tooltip.transition().duration(200).style('opacity', .9);
                tooltip.html(`Relationship: FRIENDS_WITH`)
                    .style('left', (event.pageX + 5) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                tooltip.transition().duration(500).style('opacity', 0);
            });

        // Create nodes
        const node = svg.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(nodes)
            .enter().append('g')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        node.append('circle')
            .attr('r', 5)
            .attr('fill', 'steelblue')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        // Add text to the node
        node.append('text')
            .text(d => d.name) // Display the actual name of the person
            .attr('x', 10) // Horizontal offset
            .attr('y', 5); // Vertical offset

        // Handle tooltip events for nodes
        node.on('mouseover', function(event, d) {
            tooltip.transition().duration(200).style('opacity', .9);
            tooltip.html(`Person: ${d.name}`)
                .style('left', (event.pageX + 5) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function(d) {
            tooltip.transition().duration(500).style('opacity', 0);
        });

        // Update positions of nodes and links on each tick
        function ticked() {
            link
                .attr('x1', d => {
                    const sourceNode = nodes.find(n => n.id === d.source);
                    return sourceNode ? sourceNode.x : 0;
                })
                .attr('y1', d => {
                    const sourceNode = nodes.find(n => n.id === d.source);
                    return sourceNode ? sourceNode.y : 0;
                })
                .attr('x2', d => {
                    const targetNode = nodes.find(n => n.id === d.target);
                    return targetNode ? targetNode.x : 0;
                })
                .attr('y2', d => {
                    const targetNode = nodes.find(n => n.id === d.target);
                    return targetNode ? targetNode.y : 0;
                });

            node
                .attr('transform', d => `translate(${d.x}, ${d.y})`);
        }

        // Drag functions
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        // Add zoom functionality to the graph
        const zoom = d3.zoom()
            .scaleExtent([0.1, 3])
            .on('zoom', (event) => {
                svg.attr('transform', event.transform);
            });

        svg.call(zoom);

    }, [data]);

    return (
        <svg id="schemaGraph"></svg>
    );
};

export default SchemaGraph;
