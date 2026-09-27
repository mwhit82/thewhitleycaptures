'use client';
import { useMemo } from 'react';
import { NextStudio } from 'next-sanity/studio';
import { StyleSheetManager } from 'styled-components';
import { createStudioConfig } from '../../sanity.config';
// Sanity's intent links need these props, but native HTML elements do not.
function shouldForwardProp(prop: string, target: unknown) {
  return typeof target !== 'string' || !['intent', 'params'].includes(prop);
}
export function WebsiteStudio({ previewEnabled }: { previewEnabled: boolean }) {
  const config = useMemo(
    () => createStudioConfig(previewEnabled),
    [previewEnabled],
  );
  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <NextStudio config={config} />
    </StyleSheetManager>
  );
}
