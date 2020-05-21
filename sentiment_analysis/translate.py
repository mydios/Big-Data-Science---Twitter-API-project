import json
import os
import pandas as pd
from ibm_watson import LanguageTranslatorV3
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from preprocessing import preprocess_tweet

# Use two IBM accounts for translation, as we need to translate +/- 1.4 million characters
# which is more the the 1 million allowed for a free account

authenticator = IAMAuthenticator('iUoVwN5js-z0xezaqTddLxAJvnk3Q4UmKZ26Hz5suvrL')
language_translator = LanguageTranslatorV3(
    version='2018-05-01',
    authenticator=authenticator
)

authenticator_2 = IAMAuthenticator('nTUebExtJJFIIpruI6Z3oWKpbjRTD9YLuugAtdafkKX1')
language_translator_2 = LanguageTranslatorV3(
    version='2018-05-01',
    authenticator=authenticator_2
)

language_translator.set_service_url('https://api.eu-gb.language-translator.watson.cloud.ibm.com/instances/6604c96d-44f1-4854-babb-582d45f73101')
language_translator_2.set_service_url('https://api.eu-gb.language-translator.watson.cloud.ibm.com/instances/9ca1afb5-ffcf-45a8-a0b7-e02551a45cfa')


tweets = pd.read_csv('../data/tweets.csv')

data = []
col_names = ['id', 'text_en']
for index, tweet in tweets.iterrows():
  # Start from where it broke last time if translation fails somewhere along the process
  if index > 0:
    pre = preprocess_tweet(tweet.text)
    translation = ''
    # Switch translator every tweet
    if (index % 2) == 0:
      tl1 = language_translator.translate(
        text=pre,
        source='nl', target='en').get_result()
      translation = tl1['translations'][0]['translation']
    else:
      tl2 = language_translator.translate(
        text=pre,
        source='nl', target='en').get_result()
      translation = tl2['translations'][0]['translation']
    
    print(index)
    # Append translation to file
    d = [[tweet.id, translation]]
    df = pd.DataFrame(data=d, columns=col_names)
    df.to_csv('../data/tweets_en.csv', mode='a', header=not os.path.exists('../data/tweets_en.csv'))

# Open tweet file and translated file
tweets = pd.read_csv('../data/tweets.csv')
en = pd.read_csv('tweets_en.csv')
# Reset indexes and copy tweet dates to translated tweets
# If all tweets got translated (which was the case) this will match correctly
en = en[['id', 'text_en']]
en = en.drop_duplicates(['id']).reset_index()[['id','text_en']]
en[['date']] = tweets[['date']
en.to_csv('../data/tweets_en.csv')