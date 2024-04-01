import express from 'express'
import bodyParser from 'body-parser';
import cors from "cors"
import words from "an-array-of-english-words"  assert { type: "json" };

const app = express();
const PORT = 3100;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Function to filter words based on input letters
const filterWords = (inputLetters, wordLength) => {
  const validWords = words.filter(word => {
    if (word.length !== wordLength) return false;
    const letters = inputLetters.split('');
    for (let char of word) {
      const index = letters.indexOf(char);
      if (index === -1) return false;
      letters.splice(index, 1);
    }
    return true;
  });
  return validWords;
};

// Route to handle word generation
app.get('/', (req,res)=> {
    res.json("heelo")
})
app.post('/generate-words', (req, res) => {
  const { inputLetters } = req.body;

  if (!inputLetters || inputLetters.length !== 6) {

    return res.status(400).json({ error: inputLetters.length});
  }

  const threeLetterWords = filterWords(inputLetters, 3);
  const fourLetterWords = filterWords(inputLetters, 4);
  const fiveLetterWords = filterWords(inputLetters, 5);
  const sixLetterWords = filterWords(inputLetters, 6);

  return res.json({ 
    threeLetterWords,
    fourLetterWords,
    fiveLetterWords,
    sixLetterWords
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});