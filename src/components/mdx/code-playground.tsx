'use client';

import { Sandpack } from '@codesandbox/sandpack-react';

interface CodePlaygroundProps {
  template?: 'react' | 'vanilla' | 'vanilla-ts' | 'react-ts';
  files?: Record<string, string>;
  theme?: 'light' | 'dark';
  showConsole?: boolean;
}

export function CodePlayground({
  template = 'react',
  files,
  theme = 'light',
  showConsole = true,
}: CodePlaygroundProps) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-200">
      <Sandpack
        template={template}
        files={files}
        theme={theme === 'dark' ? 'dark' : 'light'}
        options={{
          showConsole,
          showConsoleButton: true,
          showLineNumbers: true,
          showTabs: true,
          editorHeight: 400,
        }}
      />
    </div>
  );
}
