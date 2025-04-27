import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, CircularProgress, Dialog, IconButton, InputBase } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { placeholderList } from "./plaholder-list";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import styles from "./input.module.scss";

const Input = () => {
    const [query, setQuery] = useState<string>("");
    const [placeholderValue, setPlaceholderValue] = useState<string>(placeholderList[0]);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isDownloading,setIsDownloading]=useState<boolean>(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const value = Math.floor(Math.random() * 5 + 1);
            setPlaceholderValue(placeholderList[value]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleGenerate = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const response = await axios.get('/api/prompt?prompt=' + query, {
                responseType: "blob",
            });

            const blob = response.data;
            const url = URL.createObjectURL(blob);
            setGeneratedImageUrl(url);
        } catch (err) {
            console.error("Error generating image:", err);
        } finally {
            setLoading(false);
            setQuery("");
        }
    };

    const handleOpenDialog = () => {
        setSelectedImage(generatedImageUrl);
    };

    const handleDownload = () => {
        setIsDownloading(true);
        const link = document.createElement("a");
        link.href = generatedImageUrl;
        link.download = "artistry.ai-image.png";
        link.click();
        setIsDownloading(false);
    };

    return (
        <>
            <Box className={styles["input-wrapper"]}>
                <InputBase
                    onChange={handleChange}
                    value={query}
                    placeholder={`Try: ${placeholderValue}`}
                    className={styles["input-field"]}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleGenerate();
                        }
                    }}
                />
                <Button
                    color="inherit"
                    variant="contained"
                    className={styles["input-button"]}
                    onClick={generatedImageUrl ? handleOpenDialog : handleGenerate}
                    disabled={loading}
                >
                    {!loading && generatedImageUrl ? (
                        <RemoveRedEyeIcon sx={{ mr: 1, mb: .5 }} fontSize="small" />
                    ) : null}
                    {loading
                        ?<Box sx={{ display:"flex", alignItems:"center", color:"var(--global-color-text)"}}> <CircularProgress size={18} color="inherit" /> &nbsp; Generating</Box>
                        : generatedImageUrl
                            ? "Preview"
                            : "+  Generate"}
                </Button>
            </Box>

            <Dialog
                open={Boolean(selectedImage)}
                onClose={() => setSelectedImage(null)}
                fullScreen
                sx={{
                    backdropFilter: 'blur(10px)',
                }}
            >
                <IconButton
                    onClick={() => {
                        setGeneratedImageUrl("");
                        setSelectedImage(null)
                    }}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        color: 'white',
                        zIndex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                        },
                    }}
                >
                    <CloseIcon />
                </IconButton>
                {selectedImage && (
                    <Box sx={{ position: 'relative', height: '100%' }}>
                        <img
                            src={selectedImage}
                            alt="Selected"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                backgroundColor: 'black',
                            }}
                        />
                        <Button
                            variant="contained"
                            disableElevation
                            className={styles["download-button"]}
                            onClick={handleDownload}
                            startIcon={<DownloadIcon />}
                        >
                           {isDownloading ? "Downloading...." : "Download"}
                        </Button>
                    </Box>
                )}
            </Dialog>
        </>
    );
};

export default Input;
