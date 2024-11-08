import neo4j from 'neo4j-driver';

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', '****'));

const handler = async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.run(`
            MATCH (a:Person)-[r:FRIENDS_WITH]->(b:Person) 
            RETURN a.name AS source, b.name AS target
        `);

        const data = result.records.map(record => ({
            source: record.get('source'),
            target: record.get('target')
        }));

        console.log('Datos procesados:', data);
        
        res.status(200).json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error fetching data' });
    } finally {
        session.close();
    }
};

export default handler;
