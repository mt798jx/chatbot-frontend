import React, { useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import FileUpload from "../file/FileUpload";
import FileList from "../file/FileList";

const HomePage = ({
                      language,
                      fileListRefreshTrigger,
                      handleFileListUpdate,
                      handleCsvCreated,
                  }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileSelect = (fileName) => {
        setSelectedFile(fileName);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #e8eaf6, #ffffff)",
                padding: "2rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Grid container spacing={4}>
                {/* Ľavá strana */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={6}
                        sx={{
                            padding: 2,
                            borderRadius: 2,
                            background: "#f5f5f5",
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{ textAlign: "center", marginBottom: 2, fontWeight: "bold" }}
                        >
                            {language === "en" ? "Upload & Files" : "Nahrávanie a súbory"}
                        </Typography>
                        <FileUpload
                            onUploadSuccess={handleFileListUpdate}
                            language={language}
                        />
                        <FileList
                            refreshTrigger={fileListRefreshTrigger}
                            onProcessingComplete={handleFileListUpdate}
                            onFileDeleted={handleFileListUpdate}
                            language={language}
                            onCsvCreated={handleCsvCreated}
                            onFileSelect={handleFileSelect} // Vybratie súboru
                        />
                    </Paper>
                </Grid>

                {/* Pravá strana */}
                <Grid item xs={12} md={8}>
                    <Paper
                        elevation={6}
                        sx={{
                            padding: 2,
                            borderRadius: 2,
                            background: "#ffffff",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                        }}
                    >
                        {selectedFile ? (
                            <>
                                <Typography
                                    variant="h5"
                                    sx={{ marginBottom: 2, fontWeight: "bold" }}
                                >
                                    {language === "en"
                                        ? `Selected File: ${selectedFile}`
                                        : `Vybraný súbor: ${selectedFile}`}
                                </Typography>
                                <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                    {language === "en"
                                        ? "Choose an action for this file:"
                                        : "Vyberte akciu pre tento súbor:"}
                                </Typography>
                                {/* Sem môžeme pridať tlačidlá pre spracovanie, náhľad alebo stiahnutie */}
                            </>
                        ) : (
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold", color: "gray" }}
                            >
                                {language === "en"
                                    ? "Select a file to view options."
                                    : "Vyberte súbor pre možnosti."}
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HomePage;