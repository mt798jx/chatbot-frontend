import React from 'react';
import { Box, Typography, Grid, Paper, useMediaQuery, useTheme } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import ChartBarIcon from '@mui/icons-material/BarChart';

const AboutPage = ({ language }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const sections = [
        {
            icon: <InfoIcon fontSize="large" color="primary" />,
            title: language === 'en' ? "Purpose" : "Účel",
            content: language === 'en'
                ? "Our application is designed to help you manage your CSV files efficiently. It offers features such as file uploading, listing, previewing, processing, and generating comparison charts."
                : "Táto aplikácia je navrhnutá tak, aby vám pomohla efektívne spravovať vaše CSV súbory. Ponúka funkcie ako nahrávanie súborov, ich zoznam, náhľad, spracovanie a generovanie porovnávacích grafov."
        },
        {
            icon: <DescriptionIcon fontSize="large" color="primary" />,
            title: language === 'en' ? "Features" : "Funkcie",
            content: language === 'en'
                ? <>
                    <Box component="ul" sx={{ paddingLeft: 2, marginTop: 1 }}>
                        <li>
                            <Typography variant="body1" component="span" fontWeight="bold">
                                File Upload:
                            </Typography> Easily upload your CSV files using drag-and-drop or by clicking the upload button.
                        </li>
                        <li>
                            <Typography variant="body1" component="span" fontWeight="bold">
                                File Management:
                            </Typography> View, preview, process, download, and delete your uploaded files seamlessly.
                        </li>
                        <li>
                            <Typography variant="body1" component="span" fontWeight="bold">
                                Processing Tools:
                            </Typography> Utilize advanced tools like ChatGPT and GeminiAI to process your data.
                        </li>
                        <li>
                            <Typography variant="body1" component="span" fontWeight="bold">
                                Visualization:
                            </Typography> Generate insightful comparison charts to analyze your data effectively.
                        </li>
                    </Box>
                </>
                : <>
                    <Box component="ul" sx={{ paddingLeft: 2, marginTop: 1 }}>
                        <li>
                            <Typography variant="body1" component="span" fontWeight="bold">
                                Nahrávanie súborov:
                            </Typography> Jednoducho nahrávajte svoje CSV súbory pomocou funkcie pretiahnutia alebo kliknutím na tlačidlo nahrávania.
                        </li>
                        <li>
                            <Typography variant="body1" component="span" fontWeight="bold">
                                Správa súborov:
                            </Typography> Prezrite si, náhľadajte, spracujte, stiahnite a odstráňte svoje nahrané súbory bez problémov.
                        </li>
                        <li>
                            <Typography variant="body1" component="span" fontWeight="bold">
                                Nástroje na spracovanie:
                            </Typography> Využite pokročilé nástroje ako ChatGPT a GeminiAI na spracovanie vašich dát.
                        </li>
                        <li>
                            <Typography variant="body1" component="span" fontWeight="bold">
                                Vizualizácia:
                            </Typography> Generujte prehľadné porovnávacie grafy na efektívnu analýzu vašich dát.
                        </li>
                    </Box>
                </>
        },
        {
            icon: <ChartBarIcon fontSize="large" color="primary" />,
            title: language === 'en' ? "Benefits" : "Výhody",
            content: language === 'en'
                ? <>
                    <Box component="ul" sx={{ paddingLeft: 2, marginTop: 1 }}>
                        <li>
                            <Typography variant="body1" component="span" fontWeight="bold">
                                Efficiency:
                            </Typography> Streamline your file management processes to save time and effort.
                        </li>
                        <li>
                            <Typography variant="body1" component="span" fontWeight="bold">
                                Accuracy:
                            </Typography> Ensure precise data processing with reliable AI tools.
                        </li>
                        <li>
                            <Typography variant="body1" component="span" fontWeight="bold">
                                Insights:
                            </Typography> Gain valuable insights through comprehensive data visualization.
                        </li>
                        <li>
                            <Typography variant="body1" component="span" fontWeight="bold">
                                User-Friendly:
                            </Typography> Intuitive interface designed for users of all technical levels.
                        </li>
                    </Box>
                </>
                : <>
                    <Box component="ul" sx={{ paddingLeft: 2, marginTop: 1 }}>
                        <li>
                            <Typography variant="body1" component="span" fontWeight="bold">
                                Efektivita:
                            </Typography> Zjednodušte procesy správy súborov a ušetríte čas a úsilie.
                        </li>
                        <li>
                            <Typography variant="body1" component="span" fontWeight="bold">
                                Presnosť:
                            </Typography> Zabezpečte presné spracovanie dát spoľahlivými AI nástrojmi.
                        </li>
                        <li>
                            <Typography variant="body1" component="span" fontWeight="bold">
                                Inzistencia:
                            </Typography> Získajte cenné poznatky prostredníctvom komplexnej vizualizácie dát.
                        </li>
                        <li>
                            <Typography variant="body1" component="span" fontWeight="bold">
                                Používateľská prívetivosť:
                            </Typography> Intuitívne rozhranie navrhnuté pre používateľov všetkých technických úrovní.
                        </li>
                    </Box>
                </>
        }
    ];

    return (
        <Box sx={{ padding: isSmallScreen ? 2 : 4 }}>
            <Grid container spacing={4}>
                {sections.map((section, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Paper elevation={3} sx={{ padding: 3, height: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                {section.icon}
                                <Typography variant={isSmallScreen ? "h6" : "h5"} sx={{ marginLeft: 1 }}>
                                    {section.title}
                                </Typography>
                            </Box>
                            <Typography variant="body1">
                                {section.content}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AboutPage;