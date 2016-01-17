#Name of the installer
OutFile "../../dist/hubisotool-x64-installer.exe"

#Set C:\hubiso as install directory
InstallDir "C:\hubiso"

# For removing Start Menu shortcut in Windows 7
RequestExecutionLevel user

#Default section start
Section

#Define output path to install directory
SetOutPath $INSTDIR

File /r ../../build/hubisotool/win64/*.*

# Define uninstaller
WriteUninstaller $INSTDIR\uninstall.exe

# create uninstal shortcut in the start menu programs directory
CreateShortCut "$SMPROGRAMS\Uninstall Hubiso Tool.lnk" "$INSTDIR\uninstall.exe"

# create app shortcut in the start menu programs directory
CreateShortCut "$SMPROGRAMS\Hubiso Tool.lnk" "$INSTDIR\hubisotool.exe"

# create app shortcut in the desktop
CreateShortCut "$DESKTOP\Hubiso Tool.lnk" "$INSTDIR\hubisotool.exe"

#Default section end
SectionEnd

# create a section to define what the uninstaller does.
# the section will always be named "Uninstall"
Section "Uninstall"

# Always delete uninstaller first
Delete $INSTDIR\uninstall.exe

# Delete uninstall shortcut
Delete "$SMPROGRAMS\Uninstall Hubiso Tool.lnk"

# Delete app shortcut start menu programs directory
Delete "$SMPROGRAMS\Hubiso Tool.lnk"

# Delete app shortcut in the desktop
Delete "$DESKTOP\Hubiso Tool.lnk"

# Delete installation directory
Delete $INSTDIR\*.*

SectionEnd
