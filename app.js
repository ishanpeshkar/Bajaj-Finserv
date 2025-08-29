const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes and origins
// This is crucial for your frontend to be able to make requests to your API
app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Helper function to check if a string is a number
const isNumeric = (str) => {
    if (typeof str != "string") return false; // not a string, can't parse
    return !isNaN(str) && // use Type conversion to determine if Number
           !isNaN(parseFloat(str));
};

// Helper function to check if a string contains only alphabets
const containsOnlyAlphabets = (str) => {
    return /^[a-zA-Z]+$/.test(str);
};

// POST /bfhl route
app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                message: "Invalid input: 'data' array is required."
            });
        }

        const oddNumbers = [];
        const evenNumbers = [];
        const alphabets = [];
        const specialCharacters = [];
        let sumOfNumbers = 0;
        let concatAlphabets = []; // Store original case alphabets for concatenation

        for (const item of data) {
            if (typeof item === 'string') {
                if (isNumeric(item)) {
                    const num = parseInt(item, 10);
                    sumOfNumbers += num;
                    if (num % 2 === 0) {
                        evenNumbers.push(item); // Push as string
                    } else {
                        oddNumbers.push(item); // Push as string
                    }
                } else if (containsOnlyAlphabets(item)) {
                    alphabets.push(item.toUpperCase()); // Convert to uppercase for display
                    concatAlphabets.push(item); // Keep original for concatenation logic
                } else if (item.length === 1 && !containsOnlyAlphabets(item) && !isNumeric(item)) {
                    // This handles single special characters, e.g., "$", "&"
                    specialCharacters.push(item);
                }
            
            }
        }

        // ... (rest of your app.js code above this section)

        // Concatenation of all alphabetical characters present in the input in the reverse
        // order in alternating caps
        // Example: "ABcD", "DOE" -> "EoDdCbAa" (reverse order, alternating caps)
        let finalConcatString = '';
        const allAlphabetsForConcat = concatAlphabets.join('').split(''); // Flatten and split
        let reverseAlphabets = allAlphabetsForConcat.reverse(); // Reverse for processing

        for (let i = 0; i < reverseAlphabets.length; i++) {
            if (i % 2 === 0) {
                finalConcatString += reverseAlphabets[i].toUpperCase();
            } else {
                finalConcatString += reverseAlphabets[i].toLowerCase();
            }
        }

        const userId = "john_doe_17091999".toLowerCase(); // **IMPORTANT: Replace with your actual full name and birthdate**
        const emailId = "john@xyz.com"; // **IMPORTANT: Replace with your actual email**
        const collegeRollNumber = "ABCD123"; // **IMPORTANT: Replace with your actual roll number**

        res.status(200).json({
            is_success: true,
            user_id: userId,
            email: emailId,
            roll_number: collegeRollNumber,
            odd_numbers: oddNumbers,
            even_numbers: evenNumbers,
            alphabets: alphabets,
            special_characters: specialCharacters,
            sum: String(sumOfNumbers), // Sum as a string
            concat_string: finalConcatString
        });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({
            is_success: false,
            message: "An internal server error occurred.",
            error: error.message
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the API at http://localhost:${PORT}/bfhl`);
});

// ... (rest of your app.js code below this section)no