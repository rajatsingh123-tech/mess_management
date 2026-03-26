/**
 * Simple keyword-based sentiment analysis
 * @param {string} feedbackText - The feedback text to analyze
 * @param {number} rating - Food rating (1-5)
 * @returns {string} - Sentiment (Positive/Negative/Neutral)
 */

function analyzeSentiment(feedbackText, rating) {
    // Convert feedback to lowercase for easier keyword matching
    const text = feedbackText.toLowerCase();
    
    // Define positive and negative keywords
    const positiveWords = ['good', 'tasty', 'nice', 'excellent', 'great', 'awesome', 
                          'delicious', 'yummy', 'perfect', 'fresh', 'clean', 'best'];
    
    const negativeWords = ['bad', 'worst', 'dirty', 'tasteless', 'terrible', 'awful',
                          'horrible', 'stale', 'cold', 'waste', 'poor', 'spoil'];
    
    // Count positive and negative words in feedback
    let positiveCount = 0;
    let negativeCount = 0;
    
    // Check each positive word
    positiveWords.forEach(word => {
        if (text.includes(word)) {
            positiveCount++;
        }
    });
    
    // Check each negative word
    negativeWords.forEach(word => {
        if (text.includes(word)) {
            negativeCount++;
        }
    });
    
    // Determine sentiment based on keywords and rating
    if (positiveCount > negativeCount && rating >= 3) {
        return 'Positive';
    } else if (negativeCount > positiveCount || rating <= 2) {
        return 'Negative';
    } else {
        return 'Neutral';
    }
}

module.exports = analyzeSentiment;