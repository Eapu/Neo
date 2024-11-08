import { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import SchemaGraph from '../components/SchemaGraph';

const Home = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/data');
            const result = await response.json();
            console.log('Received data:', result);
            setData(result);
        };

        fetchData();
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Schema Visualization
            </Typography>
            <SchemaGraph data={data} />
        </Container>
    );
};

export default Home;
