import React from "react";
import { Box, Gutter, Grid, H1, H6, P } from "@truework/ui";

import { Single } from './components/Single';
import { Multi } from './components/Multi';
// import { Scroll } from './components/Scroll';
import { ComboboxSingle } from './components/ComboboxSingle';

export function App() {
  return (
    <Gutter withVertical>
      <Box pb="xxl" mb="xxl">
        <H1 textAlign="center">use-drop</H1>
        <P textAlign="center"><a href="https://github.com/estrattonbailey/use-drop">github</a></P>
      </Box>

      <Grid.Row alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Grid.Item width={[1, 1, 1/2]}>
          <Box display="flex" justifyContent="center" pb="40vh">
            <Box>
              <H6 mb="xs" color="secondary">Single</H6>
              <Single />
            </Box>
          </Box>
        </Grid.Item>
        <Grid.Item width={[1, 1, 1/2]}>
          <Box display="flex" justifyContent="center" pb="40vh">
            <Box>
              <H6 mb="xs" color="secondary">Multi</H6>
              <Multi />
            </Box>
          </Box>
        </Grid.Item>
        {/*
        <Grid.Item width={[1, 1, 1/2]}>
          <Box display="flex" justifyContent="center" pb="40vh">
            <Box>
              <H6 mb="xs" color="secondary">Multi</H6>
              <Scroll />
            </Box>
          </Box>
        </Grid.Item>
        */}
        <Grid.Item width={[1, 1, 1/2]}>
          <Box display="flex" justifyContent="center" pb="40vh">
            <Box>
              <H6 mb="xs" color="secondary">Combobox</H6>
              <ComboboxSingle />
            </Box>
          </Box>
        </Grid.Item>
      </Grid.Row>
    </Gutter>
  );
}
