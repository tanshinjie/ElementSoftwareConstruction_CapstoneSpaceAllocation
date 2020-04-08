import sys
import random


class FileFuzzer:
    def __init__(self):
        self.oFile = open("C:/Users/zhouw/Downloads/Telegram Desktop/Q7.Homework/Q7.Homework/output.txt", "w")

    def generate(self,n):
        count = 0
        length = n
        characters = []
        checkA = 0
        checkB = 0
        checkE = 0
        checkJ = 0
        checkM = 0
        list0 = ["a","b","e"]
        list1 = ["a","b","e","c","p","q","d","r","s","f","g","h","i","j","m"]
        list2 = ["e","c","p","q","d","r","s"]
        list3 = ["b","c","p","q","f"]
        list4 = ["a","d","r","s","f"]
        list5 = ["a","b","e","c","p","q","d","r","s","f","g","h","i","j","k"]
        list6 = ["a","b","e","c","p","q","d","r","s","f","g","h","i","m","l","n","o"]
        list7 = ["a","b","e","c","p","q"]
        list8 = ["a","b","e","d","r","s"]
        list9 = ["a","b","e","f"]

        while count < length:
            i = random.randint(0,len(list0)-1)
            j = list0[i]
            characters.append(j)

            if j == "a" :
                checkA = 1
            if j == "b" :
                checkB = 1
            if j == "e" :
                checkE = 1
            if checkA == 1 and checkB == 1 and checkE == 1:
                list0 = list1
                if j == "j" and checkJ == 0:
                    checkJ = 1
                if j == "j" and checkJ == 1:
                    checkJ = 0
                if j == "m" and checkM == 0:
                    checkM = 1
                if j == "m" and checkM == 1:
                    checkM = 0
                if checkJ == 1:
                    list0 = list5
                if checkM == 1:
                    list0 = list6
            elif checkA == 1 and checkB == 1:
                list0 = list2
            elif checkA == 1 and checkE == 1:
                list0 = list3
            elif checkB == 1 and checkE == 1:
                list0 = list4
            elif checkA == 1:
                list0 = list7
            elif checkB == 1:
                list0 = list8
            elif checkE == 1:
                list0 = list9
            count += 1
        print("Generating", "".join(characters), len("".join(characters)))
        self.oFile.write("".join(characters) + "\n")
        self.oFile.close()


fileFuzzer = FileFuzzer()
fileFuzzer.generate(166)
