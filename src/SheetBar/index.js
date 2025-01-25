import { PostAdd } from "@mui/icons-material";
import "./SheetBar.css";
import { CreateSheetAction } from "../reducer";
import React, { useEffect } from "react";

/*
 * This component is used to create new sheets.
 * It is also responsible to provide switching sheets capabilities.
 * It updates the global state in app component using the dispatch fn.
 */

function Sheetbar({ switchSheet, sheets, dispatch, currentSheet }) {
  // Ensure that the first sheet is created when the component is mounted
  useEffect(() => {
    if (sheets.length === 0) {
      const newSheetName = "sheet" + (sheets.length + 1);
      dispatch(CreateSheetAction(newSheetName)); // Create the sheet
      switchSheet(newSheetName); // Set the newly created sheet as current
    }
  }, [sheets.length, dispatch, switchSheet]);

  const handleCreateSheet = () => {
    const newSheetName = "sheet" + (sheets.length + 1);
    dispatch(CreateSheetAction(newSheetName)); // Create the sheet
    switchSheet(newSheetName); // Set the newly created sheet as current
  };

  return (
    <div className="sheetbar-container">
      <PostAdd
        className="sheetbar-items"
        onClick={handleCreateSheet} // Use the handler to create and switch
      />
      {sheets.length > 0 &&
        sheets.map((s) => {
          return (
            <span
              key={s}
              onClick={() => {
                switchSheet(s);
              }}
              className={`sheetbar-items sheet-switch-button ${
                currentSheet === s ? "current-sheet" : ""
              }`}
            >
              {s}
            </span>
          );
        })}
    </div>
  );
}

export default React.memo(Sheetbar);
