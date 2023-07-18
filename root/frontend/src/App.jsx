import Header from "./components/Header";
import StegContainer from "./components/StegContainer";

function App() {
  return (
    <div className="">
      <Header />
      <StegContainer
        stegTechnique={"Linear LSB"}
        encodeUri={"https://stego-back.onrender.com/api/steg/llsb/encode"}
        decodeUri={"https://stego-back.onrender.com/api/steg/llsb/decode"}
      />
      <StegContainer
        stegTechnique={"Random LSB"}
        encodeUri={"https://stego-back.onrender.com/api/steg/rlsb/encode"}
        decodeUri={"https://stego-back.onrender.com/api/steg/rlsb/decode"}
      />
    </div>
  );
}

export default App;
