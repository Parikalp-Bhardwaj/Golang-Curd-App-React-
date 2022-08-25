import logo from './logo.svg';
// import './App.css';
import Main from "./components/Mian"

import { ChakraProvider } from '@chakra-ui/react'
function App() {
  return (
    <div className="">

      <ChakraProvider>
        <Main />
      </ChakraProvider>
    </div>
  );
}

export default App;
