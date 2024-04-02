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

const filterWords = (inputLetters, maxLength) => {
  const inputMap = {};
  for (let letter of inputLetters) {
    inputMap[letter] = (inputMap[letter] || 0) + 1;
  }

  return words.filter(word => {
    if (word.length > maxLength) return false;
    const wordMap = {};
    for (let char of word) {
      wordMap[char] = (wordMap[char] || 0) + 1;
      if (wordMap[char] > (inputMap[char] || 0)) return false;
    }
    return true;
  });
};

// Route to handle word generation
app.get('/', (req,res)=> {
    res.json("heelo")
})
app.post('/generate-words', (req, res) => {
  const { inputLetters } = req.body;
  if (!inputLetters || inputLetters.length !== 6) {
    return res.status(400).json({ error: 'Please provide 6 letters' });
  }

  const maxLength = Math.min(6, inputLetters.length);
  const validWords = filterWords(inputLetters, maxLength);

  const wordGroups = {};
  for (let word of validWords) {
    const length = word.length;
    if (!wordGroups[length]) {
      wordGroups[length] = [];
    }
    wordGroups[length].push(word);
  }

  return res.json(Object.values(wordGroups));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});