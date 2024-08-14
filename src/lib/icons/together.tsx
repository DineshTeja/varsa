import React, { ComponentProps } from 'react';

const TogetherIconRaw: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="200"
    height="200"
    viewBox="0 0 200 200"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <g transform="translate(0.000000,200.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
      <path d="M527 1740 c-182 -46 -303 -230 -267 -406 23 -114 93 -204 198 -255
        39 -20 63 -24 142 -24 82 0 103 4 151 26 72 34 134 96 168 168 22 48 26 69 26
        151 -1 115 -22 167 -100 246 -78 79 -216 119 -318 94z" />
    </g>
  </svg>
);

export const TogetherIcon = (props: ComponentProps<typeof TogetherIconRaw>) => <TogetherIconRaw {...props} />;
