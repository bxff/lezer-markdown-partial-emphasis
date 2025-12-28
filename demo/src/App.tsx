import { useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { PartialEmphasis } from '@partial-emphasis/extension'
import './App.css'

const initialDoc = `# Partial Emphasis Demo

Try typing emphasis without closing it:

*this is italic that extends to the end of the line

**this is bold that extends to the end

Standard closed emphasis still works:

*closed italic* and **closed bold**
`

function App() {
  const [value, setValue] = useState(initialDoc)

  return (
    <CodeMirror
      value={value}
      height="100vh"
      extensions={[markdown({ extensions: [PartialEmphasis] })]}
      onChange={(val) => setValue(val)}
      theme="dark"
    />
  )
}

export default App
