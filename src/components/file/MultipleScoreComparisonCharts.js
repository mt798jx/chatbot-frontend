import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { fetchComparisonData } from './services-react/_api/file-service';  // Import the simplified service

const MultipleScoreComparisonCharts = () => {
    const [data, setData] = useState([]);  // State to store mock data

    useEffect(() => {
        // Fetch comparison data using the fetchComparisonData method
        const fetchData = async () => {
            try {
                const comparisonData = await fetchComparisonData();  // Fetch mock data
                const formattedData = Object.keys(comparisonData).map((range) => ({
                    range,
                    count: comparisonData[range],
                }));
                setData(formattedData);
            } catch (error) {
                console.error("Error fetching comparison data", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ marginBottom: "50px" }}>
            <h3>Comparison for Test Data</h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MultipleScoreComparisonCharts;