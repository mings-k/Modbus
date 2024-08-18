import React from 'react';
import Mdbus from './components/mdbus.jsx'
import Floatingbtn from './components/floatingbtn.jsx';

function App(){
  return(
    <div className='App'>
    <Mdbus /> {/* Mdbus 컴포넌트를 렌더링 */}
    <Floatingbtn/>
    </div>
  )
}

export default App