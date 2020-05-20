#python stm imports
import os
from os import path
import csv
from collections import defaultdict

#user imports
from sentiment_analyser import SentimentAnalyser

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
        tweets_per_day[row[1]].append(row[3])

sentiment_analyser = SentimentAnalyser()
sentiments_per_day = {key:0 for key in tweets_per_day.keys()}

bad_tweets = []
for key in tweets_per_day.keys():
    tweets_of_day = tweets_per_day[key]
    sentiments = []
    for tweet in tweets_of_day:
        try:
            sentiments.append(sentiment_analyser.get_sentiment(tweet))
            print("succes")
        except:
            bad_tweets.append(tweet)
            print("fail")
    sentiments_per_day[key] = (sum(sentiments)/len(sentiments))

print(sentiments_per_day)

