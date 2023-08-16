import * as React from 'react';
import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import Box from '@mui/joy/Box';
import Drawer from '@mui/joy/Drawer';
import ButtonGroup from '@mui/joy/ButtonGroup';
import List from '@mui/joy/List';
import Divider from '@mui/joy/Divider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import JoyUsageDemo, { prependLinesSpace } from 'docs/src/modules/components/JoyUsageDemo';

export default function CheckboxUsage({ window }) {
  return (
    <JoyUsageDemo
      componentName="Darawer"
      data={[
        {
          propName: 'variant',
          knob: 'radio',
          defaultValue: 'plain',
          options: ['plain', 'outlined', 'soft', 'solid'],
        },
        {
          propName: 'color',
          knob: 'color',
          defaultValue: 'neutral',
        },
      ]}
      renderDemo={(props) => {
        const [state, setState] = React.useState({
          top: false,
          left: false,
          bottom: false,
          right: false,
        });

        const toggleDrawer = (anchor, open) => (event) => {
          if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
          }
      
          setState({ ...state, [anchor]: open });
        };
      
        const list = (anchor) => (
          <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250, m: 3 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
          >
            <List>
              {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text) => (
                <ListItem key={text}>
                  <ListItemButton>{text}</ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {['All mail', 'Trash', 'Spam'].map((text) => (
                <ListItem key={text}>
                  <ListItemButton>{text}</ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        );
      
        return (
          <React.Fragment>
            <ButtonGroup variant="outlined">
              {['left', 'right', 'top', 'bottom'].map((anchor) => (
                <Button key={anchor} onClick={toggleDrawer(anchor, true)}>
                  {anchor}
                </Button>
              ))}
            </ButtonGroup>
            {['left', 'right', 'top', 'bottom'].map((anchor) => (
              <Drawer
                key={anchor}
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
              >
                <Sheet {...props}>
                  {list(anchor)}
                </Sheet>
              </Drawer>
            ))}
          </React.Fragment>
        );
      }}
    />
  );
}
