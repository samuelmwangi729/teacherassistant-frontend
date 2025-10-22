import React from 'react'
import FileUpload from './FileUpload'
import { BrowserRouter as Approuter,Routes,Route } from 'react-router-dom'
import FileUploadE from './Excel/FileUpload'
const App = () => {
  return (
    <Approuter>
      <Routes>
        <Route index element={<FileUpload/>}/>
        <Route path='/excel' element={<FileUploadE/>}/>
      </Routes>
    </Approuter>
  )
}

export default App
