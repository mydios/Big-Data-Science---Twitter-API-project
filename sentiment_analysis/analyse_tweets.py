#python stm imports
import os
import pandas as pd
from os import path
import csv
import time
from collections import defaultdict

#user imports
from sentiment_analyser import SentimentAnalyser
from preprocessing import preprocess_tweet

#check if data directory is in it's expected place
if not path.isdir(os.getcwd()+'/data'):
    #if not in this directory try parent directory
    original = path.dirname(os.getcwd())
    os.chdir(original)
    parent = os.getcwd()
    if not path.isdir(parent+'/data'):
        raise Exception("No data directory was found at %s or %s"%(original, parent))
    else:
        os.chdir(os.getcwd()+'/data')

else:
    os.chdir(os.getcwd()+'/data')

tweets_per_day = defaultdict(list)

tweets_en = pd.read_csv('tweets_en.csv')
tweet_sentiments = []
sentiment_analyser = SentimentAnalyser()

for index, tweet in tweets_en.iterrows():
  #process row
  tweets_per_day[tweet['date']].append(preprocess_tweet(tweet['text_en']))
  sentiment = sentiment_analyser.get_sentiment(tweet['text_en'])
  tweet_sentiments.append([tweet['id'],tweet['date'],tweet['text_en'],sentiment])

sent_df = pd.DataFrame(data=tweet_sentiments, columns=['id', 'date', 'text_en', 'sentiment'])
sent_df.to_csv('tweets_sentiment')
sentiments_per_day = {key:0 for key in tweets_per_day.keys()}
import numpy as np
bad_tweets = []
for key in tweets_per_day.keys():
    tweets_of_day = tweets_per_day[key]
    sentiments = []
    for tweet in tweets_of_day:
        try:
            sentiments.append(sentiment_analyser.get_sentiment(tweet))
        except:
            bad_tweets.append(tweet)
    sentiments_per_day[key] = (sum(sentiments)/len(sentiments))
    #write results of each day to protect intermediate results
    with open('sentiments_per_day.csv', 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([key, sentiments_per_day[key]])
    

