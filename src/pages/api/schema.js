import neo4j from 'neo4j-driver';

// Neo4j driver instance to connect to the database
const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '//neoo.O33'));

const handler = async (req, res) => {
    const session = driver.session(); // Start a new session
    try {
        // Run the Neo4j procedure to get the schema visualization
        const result = await session.run('CALL db.schema.visualization()');
        // Initialize the schema data structure
        const schemaData = {
            nodes: [],
            relationships: []
        };
        // Process each record returned from the query
        result.records.forEach(record => {
            const nodes = record.get('nodes');
            const relationships = record.get('relationships');

            // Node with an id and name
            if (Array.isArray(nodes)) {
                nodes.forEach(node => {
                    schemaData.nodes.push({
                        id: node.identity.toString(),
                        name: node.labels[0] // Display first label
                    });
                });
            }

            // Format each relationship
            if (Array.isArray(relationships)) {
                relationships.forEach(rel => {
                    schemaData.relationships.push({
                        source: rel.start.toString(),
                        target: rel.end.toString()
                    });
                });
            }
        });

        console.log('schemaData:', schemaData);

        res.status(200).json(schemaData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error fetching schema' });
    } finally {
        session.close();
    }
};

export default handler;
