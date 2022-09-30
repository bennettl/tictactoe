import { Box, Grid, IconButton } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

// undefined -> no selected
// 0 -> player 1 selected ==> O
// 1 -> player 2 selected ==> X

interface TicTacBoxProps {
  value?: number;

  x: number;

  y: number;

  onClick: (x: number, y: number) => void;
}

const TicTacBox = ({ value, x, y, onClick }: TicTacBoxProps) => {
  const renderContent = () => {
    if (value === undefined) {
      return <AddIcon />;
    }

    if (value === 0) {
      return <CircleIcon />;
    } else if (value === 1) {
      return <CloseIcon />;
    } else {
      throw new Error("this shouldn't happen");
    }
  };

  return (
    <Box style={{ padding: 12 }}>
      <IconButton onClick={(evt) => onClick(x, y)}>
        {renderContent()}
      </IconButton>
    </Box>
  );
};

export const Board = () => {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [selections, setSelections] = useState<Array<(number | undefined)[]>>([
    Array(3).fill(undefined),
    Array(3).fill(undefined),
    Array(3).fill(undefined),
  ]);

  const handleClick = (x: number, y: number) => {
    console.log(`handleClick x:${x} y:${y}`);

    const newSelections = [
      [...selections[0]],
      [...selections[1]],
      [...selections[2]],
    ];

    newSelections[y][x] = currentPlayer;

    console.log("newSelections");
    console.log(newSelections);
    setSelections(newSelections);

    setCurrentPlayer(currentPlayer === 0 ? 1 : 0);
  };

  const checkWinner = useCallback(() => {
    // Check horizontally
    // const horizontal = selections.filter((column) => {
    //   // All Os or Xs
    //   return (
    //     column.filter((row) => row === 0).length === column.length ||
    //     column.filter((row) => row === 1).length === column.length
    //   );
    // });

    // Check vertically
    const vertical =
      isEqual(selections[0][0], selections[1][0], selections[2][0]) ||
      isEqual(selections[0][1], selections[1][1], selections[2][1]) ||
      isEqual(selections[0][2], selections[1][2], selections[2][2]);

    // Check diagonally
    const diagonal =
      isEqual(selections[0][0], selections[1][1], selections[2][2]) ||
      isEqual(selections[2][0], selections[1][1], selections[0][2]);

    return vertical || diagonal;
  }, [selections]);

  const isEqual = (x?: number, y?: number, z?: number) => {
    return x === y && y === z && x !== undefined;
  };

  useEffect(() => {
    const hasWinner = checkWinner();
    if (hasWinner) {
      alert(`someone won`);
      return;
    }
  }, [selections, checkWinner]);

  /**
   * ----------
   * | 0,0 | 0,1 | 0,2|
   * ----------
   * | 1,0 |1,1  | 1,2 |
   * ----------
   * | 2,0 |2,1  |2,2  |
   * ----------
   */

  return (
    <Grid container style={{ width: 300 }}>
      {selections.flatMap((row, y) =>
        row.map((value, x) => (
          <Grid key={`key_${x}_${y}`} item xs={4}>
            <TicTacBox value={value} x={x} y={y} onClick={handleClick} />
          </Grid>
        ))
      )}
    </Grid>
  );
};
