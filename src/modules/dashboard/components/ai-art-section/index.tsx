import { Box, Typography } from "@mui/material"
import BentoGrid from "./bento-grid"
import styles from "./ai-art-section.module.scss"

const AIArtSection = () => {
    return (
        <Box className={styles["ai-art-section"]}>
            <Typography variant="h2" component="h2" className={styles["ai-art-section-title"]}>AI-Generated Art</Typography>
             <BentoGrid/>
        </Box>
    )
}

export default AIArtSection
