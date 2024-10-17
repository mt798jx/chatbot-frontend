import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { fetchCsv, fetchComparisonData } from './services-react/_api/file-service'; 

const MultipleScoreComparisonCharts = () => {
    const [fileData, setFileData] = useState([]);

    useEffect(() => {
        const fetchFilesAndData = async () => {
            try {
                const files = await fetchCsv();
                const fileDataPromises = files.map(async (fileName) => {
                    const comparisonData = await fetchComparisonData(fileName);
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