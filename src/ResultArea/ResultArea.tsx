import React, { useEffect, useRef } from "react";
import Katex from "katex";
import "katex/dist/katex.min.css";

export interface ResultProps {
  renderString: string;
}

export const ResultArea = (props: ResultProps) => {
  const { renderString } = props;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      Katex.render(renderString, ref.current, {
        displayMode: true,
        throwOnError: false,
      });
    }
  }, [renderString, ref]);

  return (
    <div>
      <span
        ref={ref}
        style={{
          fontSize: "xx-large",
        }}
      ></span>
    </div>
  );
};
