'use client';

import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Dialog, IconButton } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import { SCROLL_PRELOAD_OFFSET } from '@/shared/constants/app-constants';
import DownloadIcon from "@mui/icons-material/Download";
import styles from "./bento-grid.module.scss";
interface ImageItem {
  image: string;
}

export default function BentoGridWithSSE() {
  const [allImages, setAllImages] = useState<ImageItem[]>([]);
  const [visibleImages, setVisibleImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const batchSize = 9;

  useEffect(() => {
    const eventSource = new EventSource('https://image.pollinations.ai/feed');

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setAllImages((prev) => [...prev, { image: parsedData.imageURL }]);
      } catch (err) {
        console.error('Error parsing event data:', err);
      }
      setLoading(false);
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (allImages.length > 0 && visibleImages.length === 0) {
      setVisibleImages(allImages.slice(0, batchSize));
    }
  }, [allImages]);

  useEffect(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - SCROLL_PRELOAD_OFFSET) {
      setVisibleImages((prev) => {
        const nextBatch = allImages.slice(prev.length, prev.length + batchSize);
        return [...prev, ...nextBatch];
      });
    }
  }, [allImages]);

  if (loading && visibleImages.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleDownload = async () => {
    if (!selectedImage) return;
  
    setIsDownloading(true);
  
    try {
      const response = await fetch(selectedImage, { mode: 'cors' });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = 'artistry.ai-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      URL.revokeObjectURL(url); // Cleanup
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  
    setIsDownloading(false);
  };

  
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: '150px',
          gap: 2,
          p: 2,
        }}
      >
        {visibleImages.map((img, index) => {
          const layout = [
            { rows: 2, cols: 1 },
            { rows: 1, cols: 1 },
            { rows: 1, cols: 1 },
            { rows: 1, cols: 1 },
            { rows: 1, cols: 2 },
            { rows: 2, cols: 2 },
            { rows: 2, cols: 1 },
            { rows: 1, cols: 1 },
            { rows: 1, cols: 2 },
          ];

          return (
            <Box
              key={index}
              sx={{
                gridColumn: `span ${layout[index % layout.length]?.cols || 1}`,
                gridRow: `span ${layout[index % layout.length]?.rows || 1}`,
                overflow: 'hidden',
                borderRadius: 3,
                boxShadow: 3,
                position: 'relative',
                cursor: 'pointer',
                '&:hover .hoverIcon': {
                  opacity: 1,
                },
              }}
            >
              <img
                src={img.image}
                alt={`bento-${index}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onClick={() => setSelectedImage(img.image)}
              />
              <IconButton
                className="hoverIcon"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.8)',
                  },
                }}
                onClick={() => setSelectedImage(img.image)}
              >
                <ZoomInIcon />
              </IconButton>
            </Box>
          );
        })}
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
          onClick={() => setSelectedImage(null)}
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
        )}
        <Button
          variant="contained"
          disableElevation
          className={styles["download-button"]}
          onClick={handleDownload}
          startIcon={<DownloadIcon />}
        >
          {isDownloading ? "Downloading...." : "Download"}
        </Button>
      </Dialog>
    </>
  );
}
