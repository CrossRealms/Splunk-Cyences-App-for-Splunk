
# Ransomware Demo

### Execution Requirements
* Operating System: Windows


### Dev Requirements
* Operating System: Windows
* Python 3
* NSIS (To create executable file)
* Python modules: py2exe, tkinter


### Steps to Create Executable file:
* Run `python setup.py py2exe`
* Rename `dist` directory to `RansomwareDemo`.
* Compress the `RansomwareDemo` to `RansomwareDemo.zip`.
* Download [NSIS](https://nsis.sourceforge.io/Download)
* Run NSIS.
* Click on `Installer based on .ZIP file` in NSIS.
* Select `RansomwareDemo.zip` file in NSIS.
* Click on `Generate`.
* This will generate `RansomwareDemo.exe` file.
