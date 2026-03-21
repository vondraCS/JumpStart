//import { useState } from 'react'

import '../css/landing.css'
import '../css/index.css'

import { PrimaryBtn } from './components/buttons'

function LandingPage() {

  return (
    <div>teststtt      
      <PrimaryBtn clickFunction = ()=>{console.log("ran")} text = "test" buttonStylingClass='.primary-button'/>

      </div>
    
  )
}

export default LandingPage
