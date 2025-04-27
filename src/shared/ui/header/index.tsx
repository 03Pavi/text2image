'use client'
import { appName } from '@/shared/constants/app-constants'
import { Box, IconButton, Typography } from '@mui/material'
import { AppLogo } from './assets'
import Image from 'next/image'
import { socialLinks } from './social-link'
import { useRouter } from 'next/navigation'
import styles from "./header.module.scss"

const Header = () => {

  const { push } = useRouter()
  const handleNavigate = (href: string) => {
    push(href)
  }
  return (
    <Box className={styles["app-header"]}>
      <Box className={styles["app-logo-title-wrapper"]}>
        <Box className={styles["app-logo-wrapper"]}>
          <Image src={AppLogo} alt="app-logo" fill />
        </Box>
        <Typography className={styles['app-title']}>{appName.toUpperCase()} </Typography>
      </Box>
      <Box className={styles["social-links"]}>
        {socialLinks.map(({ icon: Icon, href }, index) => {
          return <IconButton onClick={()=>handleNavigate(href)} color='inherit' key={index} className={styles["social-link-item"]}>
            {Icon}
          </IconButton>
        })}
      </Box>
    </Box>

  )
}

export default Header
