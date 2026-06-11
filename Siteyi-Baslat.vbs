' Dila Lazer - Site baslatma (Notepad sorunu icin guvenilir yontem)
Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
folder = fso.GetParentFolderName(WScript.ScriptFullName)

cmd = "cmd /k ""cd /d """ & folder & """ && " & _
      "set ""PATH=C:\Program Files\nodejs;%PATH%"" && " & _
      "title Dila Lazer - Dev Server && " & _
      "echo. && " & _
      "echo  ================================ && " & _
      "echo   DILA LAZER - Site Baslatiliyor && " & _
      "echo  ================================ && " & _
      "echo. && " & _
      "echo [1/3] Eski sunucu kapatiliyor... && " & _
      "taskkill /F /IM node.exe >nul 2>&1 && " & _
      "echo [2/3] Onbellek temizleniyor... && " & _
      "if exist .next rmdir /s /q .next && " & _
      "echo [3/3] Sunucu baslatiliyor... && " & _
      "echo. && " & _
      "echo  Adres: http://localhost:3000 && " & _
      "echo  Kapatmak icin bu pencerede Ctrl+C basin. && " & _
      "echo. && " & _
      "npm run dev"""

shell.Run cmd, 1, False
