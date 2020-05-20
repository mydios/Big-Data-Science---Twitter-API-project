import unicodedata
from unidecode import unidecode
import re


def deEmojify(inputString):
    #source: https://stackoverflow.com/questions/43797500/python-replace-unicode-emojis-with-ascii-characters/43813727#43813727
    """helper function to remove emoji unicode from strings

    Args:
        inputString (string): original string

    Returns:
        string: deemojified string
    """
    returnString = ""

    for character in inputString:
        try:
            character.encode("ascii")
            returnString += character
        except UnicodeEncodeError:
            replaced = unidecode(str(character))
            if replaced != '':
                returnString += replaced
            else:
                try:
                     returnString += "[" + unicodedata.name(character) + "]"
                except ValueError:
                     returnString += "[x]"

    return returnString


def preprocess_tweet(tweet:str):
    #remove links
    tweet = re.sub(r'\S*http\S*', '', tweet, flags=re.MULTILINE)
    #remove @
    tweet = re.sub(r'\S*@\S*', '', tweet, flags=re.MULTILINE)
    tweet = deEmojify(tweet)
    return tweet

if (__name__ == '__main__'):
    print(preprocess_tweet("@ALL https://stackoverflow.com/questions/43797500/python-replace-unicode-emojis-with-ascii-characters/43813727#43813727 is a super useful link!! 🤩🤩"))