import React, { StrictMode } from "react";
import { Canvas } from "../Canvas";
import { ResultArea } from "../ResultArea";
import { useState, useEffect } from "react";
import { Navbar } from "../Navbar/Navbar";
import { Point } from "../Types";
import Appkey from "../appkey.json";

export const App = () => {
  const [stroke, setStroke] = useState<Point[]>([]);
  const [strokes, setStrokes] = useState<Point[][]>([]);

  const [undoStack, setUndoStack] = useState<Point[][]>([]);
  const [operations, setOperations] = useState<string[]>([]);
  const [operationsUndo, setOperationsUndo] = useState<string[]>([]);

  const [isDrawing, setIsDrawing] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [appToken, setAppToken] = useState<string>("");
  const [sessionID, setSessionID] = useState<string>("");

  const [uploadData, setUploadData] = useState<object>();

  const [renderString, setRenderString] = useState<string>("");

  const [requireCount, setRequireCount] = useState<number>(0);

  const height = 500;
  const width = 1000;
  const linewidth = 3;

  useEffect(() => {
    requireAppToken();
  }, []);

  useEffect(() => {
    console.log(appToken);
    if (appToken !== "") {
      requireRecgonition();
    }
  }, [appToken]);

  const requireAppToken = async () => {
    var headers = new Headers();
    headers.append("app_key", Appkey.appkey);
    headers.append("Content-Type", "application/json");

    var dataRaw = JSON.stringify({
      include_strokes_session_id: true,
    });

    var requestOptions: Object = {
      method: "POST",
      headers: headers,
      body: dataRaw,
      redirect: "follow",
    };

    await fetch("https://api.mathpix.com/v3/app-tokens", requestOptions)
      .then((response) =>
        response.status === 200
          ? response.json()
          : () => {
              throw new Error("error getting apptoken");
            }
      )
      .then((data) => {
        setAppToken(data.app_token);
        setSessionID(data.strokes_session_id);
      })
      .catch((error) => {
        console.error(error);
      });
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(appToken);
      }, 2000);
    });
  };

  const requireRecgonition = async () => {
    var headers = new Headers();
    headers.append("app_token", appToken);
    headers.append("Content-Type", "application/json");

    var dataRaw = JSON.stringify(uploadData);

    var requestOptions: Object = {
      method: "POST",
      headers: headers,
      body: dataRaw,
      redirect: "follow",
    };

    fetch("https://api.mathpix.com/v3/strokes", requestOptions)
      .then(async (response) => {
        if (response.status === 401) {
          if (requireCount > 4) {
            console.error("Timeout for token require!");
            return null;
          }
          await requireAppToken();
          setRequireCount(requireCount + 1);
          return null;
        }
        return response.json();
      })
      .then((result) => {
        if (result && result.latex_styled) {
          setRenderString(result.latex_styled);
          setRequireCount(0);
        } else {
          setRenderString("");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (uploadData) requireRecgonition();
  }, [uploadData]);

  const transformData = (tempStrokes: Point[][]) => {
    let strokeX: number[],
      strokeY: number[],
      strokesX: number[][] = [],
      strokesY: number[][] = [];
    for (const stroke of tempStrokes) {
      strokeX = [];
      strokeY = [];
      for (const point of stroke) {
        strokeX.push(point.x);
        strokeY.push(point.y);
      }
      strokesX.push(strokeX);
      strokesY.push(strokeY);
    }
    let data: Object = {
      strokes: { strokes: { x: strokesX, y: strokesY } },
      strokes_session_id: sessionID,
      formats: ["latex_styled", "data"],
      data_options: {
        include_asciimath: true,
        include_mathml: true,
        include_latex: true,
      },
      include_line_data: true,
    };
    setUploadData(data);
  };

  const handlePointerDown = (point: Point) => {
    setIsDragging(true);
    if (isDrawing) {
      setStroke((stroke) => [...stroke, point]);
      setStrokes((strokes) => [...strokes, stroke]);
    } else {
      checkCollision(point);
    }
  };

  const handlePointerMove = (point: Point) => {
    if (isDragging) {
      if (isDrawing) {
        setStroke((stroke) => [...stroke, point]);
        setStrokes((strokes) => [...strokes.slice(0, -1), stroke]);
      } else {
        checkCollision(point);
      }
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    if (isDrawing) {
      setStroke([]);
      setOperations((operations) => [...operations, "draw"]);
      transformData(strokes);
    }
  };

  const handleUndo = () => {
    if (operations.length <= 0) {
      return;
    }
    const operation: string = operations[operations.length - 1];
    setOperations((operations) => operations.slice(0, -1));
    if (operations[operations.length - 1] === "draw") {
      removeLastStroke();
    } else {
      restoreLastStroke();
    }
    setOperationsUndo((operationsUndo) => [...operationsUndo, operation]);
  };

  const handleRedo = () => {
    if (operationsUndo.length <= 0) {
      return;
    }
    const operationUndo = operationsUndo[operationsUndo.length - 1];
    setOperationsUndo((operationsUndo) => operationsUndo.slice(0, -1));
    if (operationUndo === "draw") {
      restoreLastStroke();
    } else {
      removeLastStroke();
    }
    setOperations((operations) => [...operations, operationUndo]);
  };

  const handleDelete = () => {
    setStrokes([]);
    setRenderString("");
  };

  const handleCut = () => {
    setIsDrawing(!isDrawing);
  };

  const removeLastStroke = () => {
    if (strokes.length <= 0) {
      return;
    }
    setUndoStack((undoStack) => [...undoStack, strokes[strokes.length - 1]]);
    const tempStrokes = strokes.slice(0, -1);
    setStrokes(tempStrokes);
    transformData(tempStrokes);
  };

  const restoreLastStroke = () => {
    if (undoStack.length <= 0) {
      return;
    }
    const tempStrokes = [...strokes, undoStack[undoStack.length - 1]];
    setStrokes(tempStrokes);
    setUndoStack((undoStack) => undoStack.slice(0, -1));
    transformData(tempStrokes);
  };

  const checkCollision = (point: Point) => {
    const x = point.x;
    const y = point.y;
    for (const tempStroke of strokes) {
      for (const tempPoint of tempStroke) {
        const tempX = tempPoint.x;
        const tempY = tempPoint.y;
        if (
          x < tempX + linewidth * 3 &&
          x > tempX - linewidth * 3 &&
          y < tempY + linewidth * 3 &&
          y > tempY - linewidth * 3
        ) {
          setOperations((operation) => [...operation, "remove"]);
          setUndoStack((undoStack) => [...undoStack, tempStroke]);
          const tempStrokes = strokes.filter((stroke) => stroke !== tempStroke);
          setStrokes(tempStrokes);
          transformData(tempStrokes);
          return;
        }
      }
    }
  };

  return (
    <StrictMode>
      {" "}
      <div
        style={{
          display: "grid",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Navbar
          onUndoClick={handleUndo}
          onRedoClick={handleRedo}
          onDeleteClick={handleDelete}
          onCutClick={handleCut}
          isDrawing={isDrawing}
        ></Navbar>
        <Canvas
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          width={width}
          height={height}
          strokes={strokes}
          linewidth={linewidth}
        ></Canvas>
        <ResultArea renderString={renderString}></ResultArea>
      </div>
    </StrictMode>
  );
};

//export default App;
