import * as React from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Link from 'docs/src/modules/components/Link';
import { useTranslate } from 'docs/src/modules/utils/i18n';
import { alpha } from '@mui/material/styles';

export default function ComponentPageTabs(props) {
  const {
    markdown: { headers },
    activeTab,
    setActiveTab,
    children,
  } = props;

  return (
    <Box className="component-tabs" sx={{ display: 'inline' }}>
      <Tabs
        value={activeTab}
        onChange={(e, value) => setActiveTab(value)}
        sx={{
          position: 'sticky',
          top: 65, // to be positioned below the app bar
          mt: 3,
          pt: 1,
          mx: {
            xs: -2,
            sm: 0,
          },
          px: {
            xs: 2,
            sm: 0,
          },
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.primaryDark[900], 0.7)
              : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(8px)',
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: 1000,
        }}
      >
        <Tab label="Demos" value="" />
        <Tab label="Component API" value="component-api" />
        {headers.hooks && headers.hooks.length > 0 && <Tab label="Hook API" value="hook-api" />}
      </Tabs>
      {children}
    </Box>
  );
}
