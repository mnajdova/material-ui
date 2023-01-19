import * as React from 'react';
import { useTranslate } from 'docs/src/modules/utils/i18n';
import Link from 'docs/src/modules/components/Link';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function ComponentDocsTabs({ hook }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="Component documentation tabs">
          <Tab label="Demos" {...a11yProps(0)} value="/" to="/" component={Link} />
          <Tab label="Component API" {...a11yProps(1)} value="/api/" to="/api" component={Link} />
          { hook && <Tab label="Hook API" {...a11yProps(2)} value="/hook-api/" to="/hook-api" component={Link} />}
        </Tabs>
      </Box>
    </Box>
  );
}
export default function ComponentTabs({ hook }) {
  return <ComponentDocsTabs hook={hook} />
}