import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { fetchCsv, fetchComparisonData } from './services-react/_api/file-service';  // Import the services

const MultipleScoreComparisonCharts = () => {
    const [fileData, setFileData] = useState([]);  // State to store data for each file

    useEffect(() => {
        // Fetch all CSV files and then fetch comparison data for each one
        const fetchFilesAndData = async () => {
            try {
                const files = await fetchCsv();  // Fetch the list of CSV files
                const fileDataPromises = files.map(async (fileName) => {
                    const comparisonData = await fetchComparisonData(fileName);  // Fetch comparison data for each file
                    const formattedData = Object.keys(comparisonData).map((range) => ({
                        range,
                        count: comparisonData[range],
                    }));
                    return { fileName, data: formattedData };  // Return file name and formatted data
                });

                const allFileData = await Promise.all(fileDataPromises);  // Wait for all promises
                setFileData(allFileData);  // Store data for all files
            } catch (error) {
                console.error("Error fetching files or comparison data", error);
            }
        };

        fetchFilesAndData();  // Call the function on component mount
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
