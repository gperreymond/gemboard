import {
  render
} from 'react-dom'

import Application from './Application'

window.localStorage.debug = 'gemboard-game:*'

render(Application(), document.getElementById('root'))
