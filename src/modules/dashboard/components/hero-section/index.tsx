import { Box } from '@mui/material'
import { appDescription, appTitle } from '@/shared/constants/app-constants'
import Input from '@/shared/ui/input'
import styles from "./hero-section.module.scss"
const HeroSection = () => {
    return (
        <Box className={styles["hero-section"]}>
            <Box className={styles["hero-section__content"]}>
                <Box className={styles["hero-section__content__title"]}>{appTitle}</Box>
                <Box className={styles["hero-section__content__description"]}>{appDescription}</Box>
                <Input />
            </Box>
        </Box>
    )
}

export default HeroSection
