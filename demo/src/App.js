import React from "react";
import { Box, Gutter, Grid, H6 } from "@truework/ui";

import { Single } from './components/Single';
import { SingleGroup } from './components/SingleGroup';
import { Multi } from './components/Multi';
import { MultiGroup } from './components/MultiGroup';
import { Scroll } from './components/Scroll';
import { Single as AutoSingle, Multi as AutoMulti } from './components/Auto';

export function App() {
  return (
    <Gutter withVertical>
      <Grid.Row alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Grid.Item width={[1, 1, 1/2]}>
          <Box display="flex" justifyContent="center" pb="50vh">
            <AutoSingle />
          </Box>
        </Grid.Item>
        <Grid.Item width={[1, 1, 1/2]}>
          <Box display="flex" justifyContent="center" pb="50vh">
            <AutoMulti />
          </Box>
        </Grid.Item>
        <Grid.Item width={[1, 1, 1/2]}>
          <Box display="flex" justifyContent="center" pb="50vh">
            <Box>
              <H6 mb="xs" color="secondary">Single</H6>
              <Single />
            </Box>
          </Box>
        </Grid.Item>
        <Grid.Item width={[1, 1, 1/2]}>
          <Box display="flex" justifyContent="center" pb="50vh">
            <Box>
              <H6 mb="xs" color="secondary">Multi</H6>
              <Multi />
            </Box>
          </Box>
        </Grid.Item>
        {/* <Grid.Item width={[1, 1, 1/2]}> */}
        {/*   <Box display="flex" justifyContent="center" pb="50vh"> */}
        {/*     <Box> */}
        {/*       <H6 mb="xs" color="secondary">Single w/ Groups</H6> */}
        {/*       <SingleGroup /> */}
        {/*     </Box> */}
        {/*   </Box> */}
        {/* </Grid.Item> */}
        {/* <Grid.Item width={[1, 1, 1/2]}> */}
        {/*   <Box display="flex" justifyContent="center" pb="50vh"> */}
        {/*     <Box> */}
        {/*       <H6 mb="xs" color="secondary">Multi w/ Groups</H6> */}
        {/*       <MultiGroup /> */}
        {/*     </Box> */}
        {/*   </Box> */}
        {/* </Grid.Item> */}
        {/* <Grid.Item width={[1, 1, 1/2]}> */}
        {/*   <Box display="flex" justifyContent="center" pb="50vh"> */}
        {/*     <Box> */}
        {/*       <H6 mb="xs" color="secondary">Multi w/ Scrolling</H6> */}
        {/*       <Scroll /> */}
        {/*     </Box> */}
        {/*   </Box> */}
        {/* </Grid.Item> */}
      </Grid.Row>
    </Gutter>
  );
}
