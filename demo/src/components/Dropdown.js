import React from "react";
import styled from "styled-components";
import { Box, Span, Icon, Button } from "@truework/ui";

const ClickableItem = styled(Box)(
  ({ theme }) => `
  cursor: pointer;
  &:hover {
    color: ${theme.colors.body};
  }
`
);

export function Item({ value, label, selected, highlighted, itemProps }) {
  return (
    <ClickableItem
      as="li"
      {...itemProps}
      py="xs"
      px="lg"
      style={{ cursor: "pointer" }}
      color={selected || highlighted ? "body" : "secondary"}
      display="flex"
      alignItems="center"
    >
      {selected ? (
        <Icon
          name="Check"
          color="primary"
          position="absolute"
          top="0"
          bottom="0"
          left="10px"
          my="auto"
        />
      ) : null}
      <Span
        fontSize={1}
        fontWeight={5}
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden"
        }}
      >
        {label}
      </Span>
    </ClickableItem>
  );
}

export function Group({
  label,
  disabled,
  items,
}) {
  return (
    <>
      <Box as="li" py="xs" px="sm">
        <Span fontSize={0} fontWeight={5} color="placeholder">
          {label}
        </Span>
      </Box>
      <Box as="ul" pl="xs">
        {items.map(i => {
          return <Item key={i.label} {...i} />;
        })}
      </Box>
    </>
  );
}

export function Outer({
  children,
  dropProps,
  ...rest
}) {
  return (
    <Box
      as="ul"
      {...dropProps}
      py="xs"
      boxShadow="medium"
      borderRadius={2}
      overflow="auto"
      position="absolute"
      bottom="0"
      left="-32px"
      width="calc(100% + 64px)"
      transform="translateY(100%) translateY(16px)"
      {...rest}
    >
      {children}
    </Box>
  );
}

export function Control({
  cta,
  controlProps,
}) {
  let label = cta;

  if (Array.isArray(cta)) {
    label = cta.length > 1 ? 'Multiple Selected' : cta[0];
  }

  return (
    <Button
      appearance="secondary"
      size="small"
      width="140px"
      textAlign="left"
      {...controlProps}
    >
      <Span
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Span
          width="100%"
          style={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden"
          }}
        >
          {label}
        </Span>
        <Icon name="ChevronDown" ml="xs" />
      </Span>
    </Button>
  );
}

