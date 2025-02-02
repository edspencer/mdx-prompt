import { renderMDX } from './index';
import {renderToStaticMarkup} from 'react-dom/server';

import { Prompt, Purpose, Instructions } from './components/index';

const MyPrompt = () => {
  return (
    <Prompt>
      Please do something cool:
      <Purpose>To do what you are told</Purpose>
      <Instructions instructions={['Do something', 'Do something else']} />
    </Prompt>
  );
};

// Render the component to string inside an async IIFE
(async () => {
  const output = await renderMDX(<MyPrompt />, renderToStaticMarkup);
  console.log(output);
})();
