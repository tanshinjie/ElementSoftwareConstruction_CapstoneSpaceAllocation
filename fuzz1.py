import sys
import random


class FileFuzzer:
    def __init__(self, file):
        self.file = file
        self.oFile = open("C:/Users/zhouw/Downloads/Telegram Desktop/Q7.Homework/Q7.Homework/output.txt", "w")

    def generate(self):
        for line in self.file.readlines():
            if line == "\n":
                self.oFile.write("\n")
            else:
                rand = random.randint(1, 3)
                if rand == 1:
                    self.replace(line)
                elif rand == 2:
                    self.swap(line)
                else:
                    self.addLength(line)
        self.file.close()
        self.oFile.close()
        

    def swap(self, line):
        print("Before Swap...", line.strip("\n"), len(line.strip("\n")))
        swapPosition = random.randint(0, len(line.strip("\n")) - 1)
        characters = list(line.strip("\n"))
        if swapPosition == len(line.strip("\n")) - 1:
            characters[swapPosition], characters[0] = (
                characters[0],
                characters[swapPosition],
            )
        else:
            characters[swapPosition], characters[swapPosition + 1] = (
                characters[swapPosition + 1],
                characters[swapPosition],
            )
        print("After Swap...", "".join(characters), len("".join(characters)))
        self.oFile.write("".join(characters) + "\n")

    def replace(self, line):
        print("Before Replace...", line.strip("\n"), len(line.strip("\n")))
        replacePosition = random.randint(0, len(line.strip("\n")) - 1)
        characters = list(line.strip("\n"))
        characters[replacePosition]= str(random.randint(1,3))
        print("After Replace...", "".join(characters), len("".join(characters)))
        self.oFile.write("".join(characters) + "\n")
            
    def addLength(self, line):
        count = 0
        print("Before AddLength...", line.strip("\n"), len(line.strip("\n")))
        characters = list(line.strip("\n"))
        added_length = random.randint(0,6*len(line.strip("\n")))
        while count < added_length:
            characters.append(str(random.randint(1,3)))
            count += 1
        print("After AddLength...", "".join(characters), len("".join(characters)))
        self.oFile.write("".join(characters) + "\n")

inputFile = open("C:/Users/zhouw/Downloads/Telegram Desktop/Q7.Homework/Q7.Homework/input.txt", "r")
fileFuzzer = FileFuzzer(inputFile)
fileFuzzer.generate()

