import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { fetchTxt, fetchComparisonData } from './services-react/_api/file-service';  // Import the services

const MultipleScoreComparisonCharts = () => {
    const [fileData, setFileData] = useState([]);  // State to store file data with graphs

    useEffect(() => {
        // Fetch all CSV files using the fetchTxt method
        const fetchFilesAndData = async () => {
            try {
                const files = await fetchTxt();  // Fetch all files
                const fileDataPromises = files.map(async (fileName) => {
                    const comparisonData = await fetchComparisonData(fileName, `${fileName}-results.csv`);
                    const formattedData = Object.keys(comparisonData).map((range) => ({
                        range,
                        count: comparisonData[range],
                    }));
                    return { fileName, data: formattedData };
                });
                const allFileData = await Promise.all(fileDataPromises);
                setFileData(allFileData);
            } catch (error) {
                console.error("Error fetching files or comparison data", error);
            }
        };

        fetchFilesAndData();
    }, []);

    return (
        <div>
            {fileData.map(({ fileName, data }) => (
                <div key={fileName} style={{ marginBottom: "50px" }}>
                    <h3>Comparison for {fileName}</h3>
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
            ))}
        </div>
    );
};

export default MultipleScoreComparisonCharts;
