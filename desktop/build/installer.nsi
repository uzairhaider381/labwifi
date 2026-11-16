; WiFi Guardian Windows Setup Script (NSIS Modern UI 2)
!include "MUI2.nsh"
!include "FileFunc.nsh"

; General Configuration
Name "WiFi Guardian"
OutFile "..\release\WiFiGuardian-Setup.exe"
InstallDir "$LOCALAPPDATA\Programs\WiFi Guardian"
InstallDirRegKey HKCU "Software\WiFiGuardian" "InstallPath"
RequestExecutionLevel user
SetCompressor /SOLID lzma

; Branding & Icons
!define MUI_ICON "icon.ico"
!define MUI_UNICON "icon.ico"
!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN "$INSTDIR\WiFi Guardian.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch WiFi Guardian now"

; UI Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Languages
!insertmacro MUI_LANGUAGE "English"

; Installer Section
Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  SetOverwrite on

  ; Copy all unpacked application files
  File /r "..\release\win-unpacked\*.*"

  ; Create Uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"

  ; Create Desktop Shortcut
  CreateShortCut "$DESKTOP\WiFi Guardian.lnk" "$INSTDIR\WiFi Guardian.exe" "" "$INSTDIR\WiFi Guardian.exe" 0

  ; Create Start Menu Shortcuts
  CreateDirectory "$SMPROGRAMS\WiFi Guardian"
  CreateShortCut "$SMPROGRAMS\WiFi Guardian\WiFi Guardian.lnk" "$INSTDIR\WiFi Guardian.exe" "" "$INSTDIR\WiFi Guardian.exe" 0
  CreateShortCut "$SMPROGRAMS\WiFi Guardian\Uninstall WiFi Guardian.lnk" "$INSTDIR\Uninstall.exe" "" "$INSTDIR\Uninstall.exe" 0

  ; Register in Windows Add/Remove Programs (Registry)
  WriteRegStr HKCU "Software\WiFiGuardian" "InstallPath" "$INSTDIR"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\WiFiGuardian" "DisplayName" "WiFi Guardian"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\WiFiGuardian" "DisplayIcon" "$INSTDIR\WiFi Guardian.exe,0"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\WiFiGuardian" "DisplayVersion" "1.0.0"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\WiFiGuardian" "Publisher" "WiFi Guardian Security Team"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\WiFiGuardian" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\WiFiGuardian" "NoModify" 1
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\WiFiGuardian" "NoRepair" 1
SectionEnd

; Uninstaller Section
Section "Uninstall"
  ; Delete Shortcuts
  Delete "$DESKTOP\WiFi Guardian.lnk"
  Delete "$SMPROGRAMS\WiFi Guardian\WiFi Guardian.lnk"
  Delete "$SMPROGRAMS\WiFi Guardian\Uninstall WiFi Guardian.lnk"
  RMDir "$SMPROGRAMS\WiFi Guardian"

  ; Delete Installed Files
  RMDir /r "$INSTDIR"

  ; Clean Registry
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\WiFiGuardian"
  DeleteRegKey HKCU "Software\WiFiGuardian"
SectionEnd
