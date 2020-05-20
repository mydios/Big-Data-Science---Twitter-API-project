#python stm imports
import os
from os import path
import csv
import time
from collections import defaultdict

#user imports
from sentiment_analyser import SentimentAnalyser
from preprocessing import preprocess_tweet

#check if data directory is in it's expected place
if not path.isdir(os.getcwd()+'\data'):
    #if not in this directory try parent directory
    original = path.dirname(os.getcwd())
    os.chdir(original)
    parent = os.getcwd()
    if not path.isdir(parent+'\data'):
        raise Exception("No data directory was found at %s or %s"%(original, parent))
    else:
        os.chdir(os.getcwd()+'\data')

else:
    os.chdir(os.getcwd()+'\data')

tweets_per_day = defaultdict(list)

with open('tweets.csv', encoding="utf8") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    #skip header
    next(csv_reader)
    for row in csv_reader:
        #process row
        tweets_per_day[row[1]].append(preprocess_tweet(row[3]))

sentiment_analyser = SentimentAnalyser()
sentiments_per_day = {key:0 for key in tweets_per_day.keys()}

import numpy as np
BATCH_SIZE = 50
current_batch = 0
bad_tweets = []
for key in tweets_per_day.keys():
    tweets_of_day = tweets_per_day[key]
    sentiments = []
    for tweet in tweets_of_day:
        current_batch += 1
        try:
            #sentiments.append(sentiment_analyser.get_sentiment(tweet))
            sentiments.append(np.random.random()*2 -1)
        except:
            bad_tweets.append(tweet)
        if (current_batch > BATCH_SIZE):
            time.sleep(0.1)
            current_batch = 0  
    sentiments_per_day[key] = (sum(sentiments)/len(sentiments))
    #write results of each day to protect intermediate results
    with open('sentiments_per_day.csv', 'w') as f:
        writer = csv.writer(f)
        writer.writerow('%s:%s'%(key, str(sentiments_per_day[key])))


print(sentiments_per_day)

