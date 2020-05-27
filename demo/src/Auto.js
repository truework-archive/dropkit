import React from "react";
import { Box, Gutter, Grid, H6 } from "@truework/ui";

import { Auto } from './components/Auto';

export function App() {
  return (
    <Gutter withVertical>
      <Grid.Row alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Grid.Item width={[1, 1, 1/2]}>
          <Box display="flex" justifyContent="center" pb="50vh">
            <Auto />
          </Box>
        </Grid.Item>
      </Grid.Row>
    </Gutter>
  );
}
