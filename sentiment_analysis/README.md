# BDS-project
 Twitter API project Big Data Science course University of Ghent, 2020

## Sentiment analysis
 Following pipelined approach was used for sentiment analysis:
	1. The raw tweets in Dutch are preprocessed to convert them to translatable ascii strings
	2. The preprocessed tweets are translated to english using the IBM translation API
	3. The Vader Sentiment framework is used to extract a polarity value in the range [-1, 1] which indicates the sentiment of the tweet


## Folder structure
 /preprocessing.py	-> Contains the 'preprocess_tweet' function which is used for preprocessing.  
 /translate.py		-> Contains the code which preprocesses and translates the tweets.
 /sentiment_analyser.py	-> Contains the SentimentAnalyser interface which uses the vaderSentiment python module to render polarity values for passed English strings
 /analyse_tweets.py	-> Contains the code which analyses the sentiment for all translated tweets.

## Demo
 To briefly demonstrate the preprocessing and sentiment analysis steps of the pipeline you can run the preprocessing.py and sentiment_analyser.py files in the command line

Jan Mariën, EMCOMSC 
Dylan Van Parys, EMCOMSC
