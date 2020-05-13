import googletrans
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

class SentimentAnalyser(object):
    """
    Analysis tool to analyse documents in any source language. 
    Makes use of the googletrans API for translation to english
    and of the vaderSentiment project to determine polarity scores 
    indicating the sentiment of the message

    Args:
        Takes no arguments
    """
    def __init__(self):
        self.translator = googletrans.Translator()
        self.analyser = SentimentIntensityAnalyzer()
    
    def get_polarity(self, document):
        """Analyse a document of any language and return the deduced polarity scores and a compound sentiment value. 

        Args:
            document (String|list of String): The original document that is to be scored 

        Returns:
            dict: A dictionary indicating the positive, negative, neutral and compound scores using the 
            (['pos', 'neg', 'neu', 'compound'], float) key-value structure. The positive, negative and 
            neutral values indicate the fraction of the document that is evaluated as such (and thus sum to 1) 
            whilst the compound value is a sentiment indication value in the range [-1, 1]. The partial range
            [-1, -0.05] can be interpreted as negative, [-0.05, 0.05] as neutral and [0.05, 1] as positive.  
        """
        return self.__analyse(document)

    def get_sentiment(self, document):
        """Analyse a document of any language and return the sentiment value that was deduced

        Args:
            document (String|list of String): The original document that is to be scored

        Returns:
            float: A sentiment indication value in the range [-1, 1]. The partial range
            [-1, -0.05] can be interpreted as negative, [-0.05, 0.05] as neutral and [0.05, 1] as positive.  
        """
        return self.get_polarity(document)['compound']
    
    def __analyse(self, document):
        translated_document = self.translator.translate(document, dest = 'en')
        return self.analyser.polarity_scores(translated_document.text)



if __name__ == "__main__":
    print("Example results of the SentimentAnalyser class\n")
    analyser = SentimentAnalyser()
    print("Example sentences in the theme of Covid-19, both in Dutch and French to show off the translation capability")
    print("Covid-19 heeft de maatschappij zoals we hem kennen voorgoed veranderd : " + str(analyser.get_polarity("Covid-19 heeft de maatschappij zoals we hem kennen voorgoed veranderd")))
    print("Le Covid-19 a changé la société connue pour toujours : " + str(analyser.get_polarity("Le Covid-19 a changé la société connue pour toujours")))

    print("\n\n")

    print("tweets by Bart De Wever:")

    t = "Ik roep op om vol te houden: kom niet samen in groep en houd buiten afstand van elkaar. Zo komen we er door."
    print(t+" : "+str(analyser.get_polarity(t)))

    t = "We moeten en willen dringend werk maken van een economisch exitplan, want de kostprijs van de lockdown loopt hoog op.\
        ‘Een kwalitatief hoogstaande gezondheidszorg kan niet bestaan zonder een sterke onderliggende economie.'"
    print(t+" : "+str(analyser.get_polarity(t)))
    t = "Een warme oproep aan u allen om deel te nemen aan dit wetenschappelijk onderzoek van de @UAntwerpen Gevouwen handen. \
        Het geeft de experten inzicht in onze gedragswijzigingen als gemeenschap en biedt hen zo ook de mogelijkheid om de evolutie van de coronacurve\
        beter in te schatten. Rug van hand met omlaag wijzende wijsvinger"
    print(t+" : "+str(analyser.get_polarity(t)))

    print("\n\n")

    print("tweets by Marc Van Ranst:")

    t = "Niemand heeft voldoende engelengeduld om dit soort van bagger te \"weerleggen\". Dit heeft niets meer met \"kritiek\"\
        te maken.Dat mag u storen; Ik zal het mij niet aantrekken.Enigszins lachend gezicht"
    print(t+" : "+str(analyser.get_polarity(t)))
    t = "Vandaag is de “internationale dag van de verpleegkundige”. Uitzonderlijke omstandigheden vragen uitzonderlijke \
        inspanningen van uitzonderlijke mensen. Jullie maken in 2020 het verschil met Covid-19. Jullie zijn allemaal uitzonderlijke mensen!"
    print(t+" : "+str(analyser.get_polarity(t)))
    t = "@Filip_Bru Ik heb nog een klacht lopen tegen die vroegere VB-jongerenvoorzitter; zijn naam ontsnapt mij."
    print(t+" : "+str(analyser.get_polarity(t)))