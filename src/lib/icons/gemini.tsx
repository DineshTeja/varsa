import React, { ComponentProps } from 'react';

const GeminiIconRaw: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 48 48">
  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M24 2.5C24 14.374 14.374 24 2.5 24M24 45.5C24 33.626 14.374 24 2.5 24M24 2.5C24 14.374 33.626 24 45.5 24M24 45.5C24 33.626 33.626 24 45.5 24"/>
</svg>
);

export const GeminiIcon = (props: ComponentProps<typeof GeminiIconRaw>) => <GeminiIconRaw {...props} />;