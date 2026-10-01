import React from 'react'
import Header from './components/layouts/Header'
import AllRoutes from './routes/AllRoutes'
import Footer from './components/layouts/Footer'

const App = () => {
  return (
    <div>
      <Header/>
      <AllRoutes/>
      <Footer/>
    </div>
  )
}

export default App