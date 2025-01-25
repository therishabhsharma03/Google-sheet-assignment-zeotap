import "./GridCell.css";
import React, { useRef } from "react";
import {
  ChangeActiveCell,
  ChangeActiveCellProperties,
  ReevaluateFormula,
  RemoveDependentCell,
} from "../reducer";

/**
This component represents an individual cell in a spreadsheet.
It handles updating the cell's data and manages interactions such as clicks and keyboard navigation.
Clicking on the cell updates the active cell state.
The dispatch function is utilized to modify the application state with updated cell information. 
*/
function GridCell({ cellState, dispatch, currentSheet }) {
  const inputRef = useRef(null); // Reference to the cell's input element

  // Updates the cell content and manages dependent formulas
  const updateCell = (content) => {
    dispatch(
      ChangeActiveCellProperties(cellState.id, currentSheet, "content", content)
    );

    dispatch(RemoveDependentCell(cellState.id, currentSheet));

    dispatch(
      ChangeActiveCellProperties(cellState.id, currentSheet, "formula", "")
    );

    cellState.dependentCells.forEach((id) => {
      dispatch(ReevaluateFormula(id, currentSheet));
    });
  };

  // Sets the active cell
  const changeActiveCell = () => {
    dispatch(ChangeActiveCell(cellState.id, currentSheet));
  };

  // Handles navigation between cells using arrow keys
  const handleKeyDown = (e) => {
    // Ensure the cell ID is valid and in the expected format
    if (!cellState.id || !cellState.id.includes("-")) {
      console.error(`Invalid cell ID: ${cellState.id}`);
      return;
    }

    // Parse the current cell's row and column indices
    const [row, col] = cellState.id.split("-").map(Number);
    if (isNaN(row) || isNaN(col)) {
      console.error(`Cell ID parsing failed: ${cellState.id}`);
      return;
    }

    let newRow = row;
    let newCol = col;

    // Determine the new cell position based on the key pressed
    switch (e.key) {
      case "ArrowUp":
        newRow = Math.max(row - 1, 0); // Move up, staying within bounds
        break;
      case "ArrowDown":
        newRow = row + 1; // Move down
        break;
      case "ArrowLeft":
        newCol = Math.max(col - 1, 0); // Move left, staying within bounds
        break;
      case "ArrowRight":
        newCol = col + 1; // Move right
        break;
      default:
        return; // Ignore other keys
    }

    // Generate the new cell ID
    const newCellId = `${newRow}-${newCol}`;
    dispatch(ChangeActiveCell(newCellId, currentSheet));

    // Focus the new cell after a brief delay to ensure the state updates
    setTimeout(() => {
      const newCell = document.getElementById(`${currentSheet}-${newCellId}`);
      if (newCell) {
        newCell.focus();
      } else {
        console.warn(`Cell with ID ${newCellId} not found.`);
      }
    }, 0);
  };

  // Styles to be applied, stored in cellState
  const extraStyle = {
    textAlign: cellState.alignment,
    fontFamily: cellState.fontFamily,
    fontSize: cellState.fontSize + "px",
    fontWeight: cellState.bold === false ? "normal" : "bold",
    fontStyle: cellState.italic === false ? "normal" : "italic",
    textDecoration: cellState.underline === false ? "none" : "underline",
    color: cellState.color || "black",
    backgroundColor: cellState.backgroundColor || "white",
  };

  return (
    <input
      ref={inputRef}
      id={`${currentSheet}-${cellState.id}`}
      className="grid-cell"
      name={cellState.id}
      value={cellState.content || ""}
      onChange={(e) => updateCell(e.target.value)}
      onFocus={changeActiveCell}
      onKeyDown={handleKeyDown} // Handle keydown events for navigation
      style={extraStyle}
    />
  );
}

export default React.memo(GridCell);
