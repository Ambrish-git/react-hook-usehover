import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import Paper from '@mui/material/Paper';
import { useCallback, useEffect, useRef, useState } from 'react';
const StyledPaper = styled(Paper)(({ theme, isHovered }) => ({
  cursor: 'pointer',
  // height: "calc(100% - 16px)",
  minHeight: 180,
  paddingBottom: '12px',
  backgroundColor: isHovered ? 'yellow' : 'yellowgreen',
  border: isHovered ? `2px solid green` : 'none',
}));
function useHoverWithUseEffect() {
  const [value, setValue] = useState(false);
  const ref = useRef(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);
  useEffect(
    // eslint-disable-next-line consistent-return
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener('mouseover', handleMouseOver);
        node.addEventListener('mouseout', handleMouseOut);
        // node.addEventListener("focus", handleMouseOver);
        // node.addEventListener("blur", handleMouseOut);
        return () => {
          node.removeEventListener('mouseover', handleMouseOver);
          node.removeEventListener('mouseout', handleMouseOut);
          // node.removeEventListener("focus", handleMouseOver);
          // node.removeEventListener("blur", handleMouseOut);
        };
      }
      // return null;
    },
    [] // Recall only if ref changes
  );
  return [ref, value];
}
function useHoverWithCallback() {
  const [value, setValue] = useState(false);

  // Wrap in useCallback so we can use in dependencies below
  const handleMouseOver = useCallback(() => setValue(true), []);
  const handleMouseOut = useCallback(() => setValue(false), []);

  // Keep track of the last node passed to callbackRef
  // so we can remove its event listeners.
  const ref = useRef();

  // Use a callback ref instead of useEffect so that event listeners
  // get changed in the case that the returned ref gets added to
  // a different element later. With useEffect, changes to ref.current
  // wouldn't cause a rerender and thus the effect would run again.
  const callbackRef = useCallback(
    (node) => {
      if (ref.current) {
        ref.current.removeEventListener('mouseover', handleMouseOver);
        ref.current.removeEventListener('mouseout', handleMouseOut);
      }

      ref.current = node;

      if (ref.current) {
        ref.current.addEventListener('mouseover', handleMouseOver);
        ref.current.addEventListener('mouseout', handleMouseOut);
      }
    },
    [handleMouseOver, handleMouseOut]
  );

  return [callbackRef, value];
}
export default function SimplePaper() {
  const [hoverRef, isHovered] = useHoverWithCallback();
  const [hoverRef2, isHovered2] = useHoverWithUseEffect();
  console.log(isHovered, isHovered2);
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: 128,
          height: 128,
        },
      }}
    >
      <StyledPaper
        tabIndex={1}
        ref={hoverRef}
        isHovered={isHovered}
      ></StyledPaper>
      <StyledPaper
        tabIndex={1}
        ref={hoverRef2}
        isHovered={isHovered2}
      ></StyledPaper>
    </Box>
  );
}
