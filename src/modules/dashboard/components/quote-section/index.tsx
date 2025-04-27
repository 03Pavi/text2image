import { Box, Typography } from '@mui/material'
import styles from "./quotes-section.module.scss"

const QuoteSection = () => {
    return (
        <Box className={styles["quote-section"]}>
            <Typography variant='h2' component='h2' className={styles["quote-section-title"]}>
                Endless possibilities,
            </Typography>
            <Typography variant='h1' component='h1' className={styles["quote-section-sub-title"]}>
                just <Typography component="span" className={styles["highlight"]}>Imagine</Typography>
            </Typography>
        </Box>
    )
}

export default QuoteSection
